import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ILoginResponse, IUserData } from './interfaces';
import { LoginDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async login(loginDto: LoginDto): Promise<ILoginResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('User Unauthorized');
    }

    const userPayload: IUserData = {
      id: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(userPayload);

    const loginResponse: ILoginResponse = {
      success: true,
      accessToken,
    };

    return loginResponse;
  }

  async validateUser(email: string, password: string): Promise<IUserData> {
    const user = await this.userService.findByEmail(email);

    if (user && (await this.comparePasswords(password, user.password))) {
      const { ...result } = user;
      return result;
    }

    return null;
  }
}
