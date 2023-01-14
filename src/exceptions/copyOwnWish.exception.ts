import { HttpException, HttpStatus } from '@nestjs/common';

export class CopyOwnWishException extends HttpException {
  constructor() {
    super(
      `Пользователь не может копировать свой подарок`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
