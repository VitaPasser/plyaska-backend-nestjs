import { Exclude, Expose } from 'class-transformer';
import { Role } from '../roles/enums/role.enum';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  role: Role;

  @Exclude()
  password: string;
}
