import { HttpException } from '@nestjs/common';
import { BAD_REQUEST_MESSAGE, NOT_FOUND_ERROR_MESSAGE } from '../constants';

export const duplicateKeyValueThrower = (
  err: Error,
  exception: HttpException,
) => {
  if (err.message.startsWith('duplicate key value')) {
    throw exception;
  }
};

export const notFoundThrower = (err: Error, exception: HttpException) => {
  if (err.message === NOT_FOUND_ERROR_MESSAGE) {
    throw exception;
  }
};

export const badRequestThrower = (err: Error, exception: HttpException) => {
  if (err.message === BAD_REQUEST_MESSAGE) {
    throw exception;
  }
};

export const violatesForeignKeyThrower = (
  err: Error,
  exception: HttpException,
) => {
  if (err.message.startsWith('insert or update')) {
    throw exception;
  }
};
