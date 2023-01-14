import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '../../jwt/jwt.service';
import { UnauthorizedUserException } from '../../exceptions/unauthorizedUser.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      request.cookies.jwt ||
      request.headers.authorization.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedUserException();
    }

    let payload;
    try {
      payload = this.jwtService.verifyToken(token);
    } catch (err) {
      //Кастомное исключение
      throw new UnauthorizedUserException();
    }

    request.user = await this.userService.findOne({ id: payload.id });

    if (!request.user) {
      throw new UnauthorizedUserException();
    }

    return true;
  }
}
