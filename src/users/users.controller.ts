import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ROLES, RolesDecorator } from '../auth/roles.guard';

@Controller('api')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('protected-data-for-role-user')
  @RolesDecorator(ROLES.USER)
  endpoint1(): string {
    return this.usersService.getDataForRoleUser();
  }

  @Get('protected-data-for-role-admin')
  @RolesDecorator(ROLES.ADMIN)
  endpoint2(): string {
    return this.usersService.getDataForRoleAdmin();
  }
}
