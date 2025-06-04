import { Injectable, NotFoundException } from '@nestjs/common';
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
    const user = this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, this.SALT_ROUNDS),
    });
    const userSaved = await this.usersRepository.save(user);
    return plainToInstance(UserResponseDto, userSaved, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<UserResponseDto[]> {
    return plainToInstance(UserResponseDto, await this.usersRepository.find(), {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) throw new NotFoundException();
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const data = {
      ...updateUserDto,
    };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(
        updateUserDto.password,
        this.SALT_ROUNDS,
      );
    }
    await this.usersRepository.update({ id }, data);
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    const removed = await this.usersRepository.remove(user);
    return plainToInstance(UserResponseDto, removed, {
      excludeExtraneousValues: true,
    });
  }
}
