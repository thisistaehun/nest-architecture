import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ExceptionCode } from './exception.code';

export class UnauthorizedCustomException extends CustomException {
  constructor(message = '인증되지 않은 사용자입니다.') {
    super(message, ExceptionCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
}
