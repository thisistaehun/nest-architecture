import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ExceptionCode } from './exception.code';

export class NotFoundCustomException extends CustomException {
  constructor(message = '존재하지 않는 정보입니다.') {
    super(message, ExceptionCode.NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
