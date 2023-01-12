import { HttpException, HttpStatus } from '@nestjs/common';

export class WishNotExistsException extends HttpException {
  constructor() {
    super('Неверно указаны id подарков', HttpStatus.NOT_FOUND);
  }
}
