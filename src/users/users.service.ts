import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    protected readonly usersRepository: Repository<User>,
  ) {}
  SALT_ROUNDS: number = 10;

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return plainToInstance(
      UserResponseDto,
      this.usersRepository.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, this.SALT_ROUNDS),
      }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async findAll(): Promise<UserResponseDto[]> {
    return plainToInstance(UserResponseDto, await this.usersRepository.find(), {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: bigint): Promise<UserResponseDto | null> {
    return plainToInstance(
      UserResponseDto,
      await this.usersRepository.findOneBy({ id }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async findByEmail(email: string): Promise<UserResponseDto | null> {
    return plainToInstance(
      UserResponseDto,
      await this.usersRepository.findOneBy({ email }),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async update(
    id: bigint,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto | null> {
    const data = {
      ...updateUserDto,
    };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(
        updateUserDto.password,
        this.SALT_ROUNDS,
      );
    }
    return plainToInstance(
      UserResponseDto,
      await this.usersRepository.update({ id }, data),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async remove(id: bigint): Promise<UserResponseDto | null> {
    return plainToInstance(
      UserResponseDto,
      await this.usersRepository.delete({ id }),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}
