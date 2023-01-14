import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyOfferedException extends HttpException {
  constructor() {
    super(`Подарок уже имеет оферы`, HttpStatus.BAD_REQUEST);
  }
}
