import { Injectable, Body, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { LoginAuthDto } from './dto/create-auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginAuthDto) {
    const existUser = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (existUser) throw new ConflictException('User have already exist');

    return loginDto.email;
  }

  logout() {
    return `This action updates a  auth`;
  }

  register() {
    return `This action removes a  auth`;
  }
}
