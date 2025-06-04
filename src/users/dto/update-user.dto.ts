import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { AdditionalRoleUserDto } from './additional-role-user.dto';

export class UpdateUserDto extends PartialType(
  IntersectionType(CreateUserDto, AdditionalRoleUserDto),
) {}
