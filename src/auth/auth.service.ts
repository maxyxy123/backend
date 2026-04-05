import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import {
  LoginAuthDto,
  RegisterAuthDto,
  UserResponseDto,
} from './dto/create-auth.dto';
import bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginAuthDto, res: Response) {
    const existUser = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!existUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      existUser.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: existUser.id,
      roles: [existUser.role],
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: existUser.id },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { message: 'Login successfully' };
  }

  logout(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { message: 'successfully log out' };
  }

  async register(registerAuthDto: RegisterAuthDto) {
    //User ton tai hay k?
    const existUser = await this.prisma.user.findUnique({
      where: { email: registerAuthDto.email ?? 'Sai roi' },
    });

    if (existUser) throw new ConflictException('User have already exist');

    //hashpassord
    const salt = await bcrypt.genSalt(10);
    const hashpassord = await bcrypt.hash(registerAuthDto.passwordHash, salt);

    const createdUser = await this.prisma.user.create({
      data: {
        fullName: registerAuthDto.fullName,
        email: registerAuthDto.email,
        passwordHash: hashpassord,
      },
    });

    return new UserResponseDto({
      email: createdUser.email,
      fullName: createdUser.fullName,
    });
  }
}
