import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async validateUser(login: LoginDto): Promise<User | null> {
    const user = await this.userRepository.findOneBy({
      email: login.email,
    });
    if (
      user !== null &&
      (await bcrypt.compare(login.password, user.password))
    ) {
      return user;
    }
    return null;
  }

  login(user: User) {
    const payload = {
      username: user.name,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
