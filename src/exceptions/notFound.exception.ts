import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(entity: string) {
    super(`${entity} не найден`, HttpStatus.NOT_FOUND);
  }
}
