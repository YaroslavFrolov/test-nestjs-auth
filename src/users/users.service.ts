import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { Role, ROLES } from '../auth/roles.guard';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

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
