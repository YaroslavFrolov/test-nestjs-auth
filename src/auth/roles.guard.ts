import {
  SetMetadata,
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { JwtPayload } from './auth.dto';

// RBAC implementation
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

const ROLES_KEY = '__roles__';

export const RolesDecorator = (...roles: Role[]) =>
  SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const user: JwtPayload = context.switchToHttp().getRequest().user;

    return requiredRoles.some((role) => user.userRoles?.includes(role));
  }
}
