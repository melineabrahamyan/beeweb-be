import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { OrNeverType } from '../../common';
import { plainToInstance } from 'class-transformer';
import { ChangePasswordDto, CreateUserDto } from './dtos';
import {
  IncorrectPasswordException,
  UserAlreadyExitsException,
  UserNotFoundException,
} from './exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByIdOrFail(id: number): Promise<OrNeverType<User>> {
    const existingUser = this.userRepository.findOneBy({ id });

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    return existingUser;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    return user;
  }

  async register(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = await this.findByEmail(createUserDto.email);
    if (user) {
      throw new UserAlreadyExitsException();
    }

    const hashedPassword = await hash(createUserDto.password, 10);

    const createdUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(createdUser);

    return plainToInstance(User, savedUser);
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<Partial<User>> {
    const user = await this.findByIdOrFail(id);

    const isMatch = await compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isMatch) {
      throw new IncorrectPasswordException();
    }

    const hashedNewPassword = await hash(changePasswordDto.newPassword, 10);
    user.password = hashedNewPassword;

    const updatedUser = await this.userRepository.save(user);

    return plainToInstance(User, updatedUser);
  }

  async getProfile(id: number): Promise<Partial<User>> {
    const user = await this.findByIdOrFail(id);
    return plainToInstance(User, user);
  }
}
