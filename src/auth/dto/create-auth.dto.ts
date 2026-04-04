import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  passwordHash: string;
}

export class UserResponseDto {
  email: string;
  fullName: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
