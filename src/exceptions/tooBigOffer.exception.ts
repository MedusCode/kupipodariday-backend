import { HttpException, HttpStatus } from '@nestjs/common';

export class ToBigOfferException extends HttpException {
  constructor() {
    super(
      `Пользователь пытается скинуться слишком много`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
