import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedUserException extends HttpException {
  constructor() {
    super(`Пользователь не авторизован`, HttpStatus.UNAUTHORIZED);
  }
}
