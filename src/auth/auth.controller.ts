import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto/create-auth.dto';
import type { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //
  @Post('login')
  login(
    @Body() loginDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }
}
