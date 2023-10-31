import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ExceptionCode } from './exception.code';

export class BadRequestCustomException extends CustomException {
  constructor(message = '잘못된 요청입니다.') {
    super(message, ExceptionCode.BAD_REQUEST, HttpStatus.BAD_REQUEST);
  }
}
