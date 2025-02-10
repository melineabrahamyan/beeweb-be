import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ChangePasswordDto, CreateUserDto } from '../user/dtos';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import { ILoginResponse, IUserData } from './interfaces';
import { UserGuard } from './guards';
import { UserData } from '../../common';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    const createdUser = await this.userService.register(createUserDto);

    return createdUser;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ILoginResponse> {
    const loginResponse = await this.authService.login(loginDto);

    return loginResponse;
  }

  @Post('change-password')
  @UseGuards(UserGuard)
  async changePassword(
    @UserData() user: IUserData,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<Partial<User>> {
    await changePasswordDto.validate();
    const userId = user.id;

    return this.userService.changePassword(userId, changePasswordDto);
  }

  @Get('get-profile')
  @UseGuards(UserGuard)
  async getProfile(@UserData() user: IUserData): Promise<Partial<User>> {
    const userId = user.id;

    return this.userService.getProfile(userId);
  }
}
