import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { Reflector } from '@nestjs/core';
type Payload = {
  sub: string;
  role: string;
};
@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.access_token as string | null;

    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    try {
      const payload: Payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      req['user'] = payload;
      console.log('req.user after set:', req['user']);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
