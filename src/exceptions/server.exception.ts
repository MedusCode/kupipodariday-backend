import { HttpException } from '@nestjs/common';

export class ServerException extends HttpException {
  constructor() {
    super(`Ошибка сервера`, 500);
  }
}
