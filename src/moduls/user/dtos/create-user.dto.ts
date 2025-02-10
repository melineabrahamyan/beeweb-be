import {
  IsString,
  IsNotEmpty,
  IsStrongPassword,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
