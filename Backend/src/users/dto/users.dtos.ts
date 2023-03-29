import { IsEmail, IsNotEmpty, MinLength, IsPhoneNumber } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
