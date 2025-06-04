import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '../roles/enums/role.enum';

export class AdditionalRoleUserDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
