import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { Role, ROLES } from '../auth/roles.guard';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // aka seeding - for dev purpose
  async onModuleInit() {
    const admin = await this.getUserByName('admin');
    if (!admin) {
      const hashPassword = await bcrypt.hash('123456', 10);
      this.createUser('admin', hashPassword, [ROLES.ADMIN, ROLES.USER]);
    }
  }

  async createUser(
    name: string,
    hashPassword: string,
    roles?: Role[],
  ): Promise<User> {
    const newUser = await this.userModel.create({
      name,
      password: hashPassword,
      roles: roles ? JSON.stringify(roles) : JSON.stringify([ROLES.USER]),
    });
    return newUser;
  }

  async getUserByName(name: string): Promise<User | null> {
    return this.userModel.findOne({ where: { name: name } });
  }

  getDataForRoleUser() {
    return 'some protected data';
  }

  getDataForRoleAdmin() {
    return 'some protected data for admin only';
  }
}
