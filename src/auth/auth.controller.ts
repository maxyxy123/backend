import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/create-auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //
  @Post()
  login(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }
  @Post()
  logout() {
    return this.authService.logout();
  }
  @Post()
  register() {
    return this.authService.register();
  }
}
