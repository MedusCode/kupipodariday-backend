import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(`Некорректная пара логин и пароль`, HttpStatus.UNAUTHORIZED);
  }
}
