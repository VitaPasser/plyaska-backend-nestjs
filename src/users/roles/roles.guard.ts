import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users.service';
import { Role } from './enums/role.enum';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole: Role = this.reflector.get(Roles, context.getHandler());
    if (!requiredRole) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userId: string = request.user.sub;
    const user = await this.usersService.findOne(userId);
    return user.role === requiredRole;
  }
}
