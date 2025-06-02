import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../entity/user.entity';

export class UserResponseDto {
  @Expose()
  id: bigint;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber: string;

  @Exclude()
  role: UserRole;

  @Exclude()
  password: string;
}
