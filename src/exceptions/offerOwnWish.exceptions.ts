import { HttpException, HttpStatus } from '@nestjs/common';

export class OfferOwnWishException extends HttpException {
  constructor() {
    super(
      `Пользователь не может скидываться на свой подарок`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
