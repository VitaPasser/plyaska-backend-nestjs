import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Role } from './roles/enums/role.enum';
import { UsersService } from './users.service';

@Injectable()
export class CurrentUserGuard implements CanActivate {
  constructor(protected readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userIdFromParam: string = request.params.id;
    if (!userIdFromParam) throw new InternalServerErrorException();
    const userIdFromToken = request.user.sub;

    const userFromToken = await this.usersService.findOne(userIdFromToken);
    if (userFromToken.role === Role.ADMIN) return true;

    if (userIdFromParam !== userIdFromToken) {
      throw new ForbiddenException();
    }
    return true;
  }
}
