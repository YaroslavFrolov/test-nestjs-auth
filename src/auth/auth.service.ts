import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RedisService } from '@nestql/redis';
import {
  LoginDTO,
  TokensDTO,
  RegisterDTO,
  RefreshDTO,
  JwtPayload,
} from './auth.dto';
import { UsersService } from '../users/users.service';
import { ConfigService } from '../config/config.service';
import { ROLES } from './roles.guard';

import type Redis from 'ioredis';

const EXP_ACCESS_TOKEN_SEC = 240; // 4min - for dev purpose
const EXP_REFRESH_TOKEN_SEC = 480; // 8min - for dev purpose
const MAX_SESSIONS = 3; // for dev purpose

type RedisKey = `session::${number}::${string}`;

const redisKey = (userId: number, refreshToken: string): RedisKey =>
  `session::${userId}::${refreshToken}`;

@Injectable()
export class AuthService {
  private readonly redisClient: Redis;

  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {
    /**
     * Not using the "black-list of tokens" approach,
     * since all idea of jwt won't make sense then.
     * So hacker will have only time of access-token live
     * to make bad things.
     */
    this.redisClient = redisService.getClient('__sessions__');
  }

  // for dev purpose
  async onModuleInit() {
    const admin = await this.usersService.getUserByName('admin');
    if (!admin) {
      const hashPassword = await bcrypt.hash('123456', 10);
      this.usersService.createUser('admin', hashPassword, [
        ROLES.ADMIN,
        ROLES.USER,
      ]);
    }
  }

  async register(body: RegisterDTO): Promise<number> {
    const hashPassword = await bcrypt.hash(body.password, 10);
    try {
      const newUser = await this.usersService.createUser(
        body.name,
        hashPassword,
      );
      return newUser.id;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async login(body: LoginDTO): Promise<TokensDTO> {
    const existUser = await this.usersService.getUserByName(body.name);

    if (!existUser) {
      throw new BadRequestException(
        'Invalid credentials or user does not exist',
      );
    }

    const isValidPassword = await bcrypt.compare(
      body.password,
      existUser.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException(
        'Invalid credentials or user does not exist',
      );
    }

    const existSessions = await this.redisClient.keys(
      `session::${existUser.id}::*`,
    );

    if (existSessions.length >= MAX_SESSIONS) {
      /**
       * Also we can send some warning to email,
       * like "Someone want to login. Was it you?"
       */
      throw new UnauthorizedException(
        'Too many sessions. Log out from one or all devices.',
      );
    }

    return this._makeSession(existUser.id, JSON.parse(existUser.roles));
  }

  async refresh(body: RefreshDTO): Promise<TokensDTO> {
    const { userId, userRoles } = await this.logout(body);
    return this._makeSession(userId, userRoles);
  }

  async logout(body: RefreshDTO): Promise<JwtPayload> {
    try {
      const jwtPayload = jwt.verify(
        body.refresh_token,
        this.configService.get('REFRESH_TOKEN_KEY'),
      ) as JwtPayload;

      const session = redisKey(jwtPayload.userId, body.refresh_token);

      await this.redisClient.del(session);

      return jwtPayload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logoutAll(body: RefreshDTO): Promise<void> {
    const { userId } = await this.logout(body);

    const existSessions = (await this.redisClient.keys(
      `session::${userId}::*`,
    )) as RedisKey[];

    for (const session of existSessions) {
      await this.redisClient.del(session);
    }
  }

  private async _makeSession(
    userId: number,
    userRoles: string[],
  ): Promise<TokensDTO> {
    const { accessToken, refreshToken } = this._makeTokens(userId, userRoles);

    await this.redisClient.set(
      redisKey(userId, refreshToken),
      1,
      'EX',
      EXP_REFRESH_TOKEN_SEC,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private _makeTokens(userId: number, userRoles: string[]) {
    const jwtPayload: JwtPayload = {
      userId: userId,
      userRoles: userRoles,
    };

    const accessToken = jwt.sign(
      jwtPayload,
      this.configService.get('ACCESS_TOKEN_KEY'),
      { expiresIn: EXP_ACCESS_TOKEN_SEC },
    );

    const refreshToken = jwt.sign(
      jwtPayload,
      this.configService.get('REFRESH_TOKEN_KEY'),
      { expiresIn: EXP_REFRESH_TOKEN_SEC },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
