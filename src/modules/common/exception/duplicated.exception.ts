import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ExceptionCode } from './exception.code';

export class DuplicatedCustomException extends CustomException {
  constructor(message = '리소스가 중복되었습니다.') {
    super(message, ExceptionCode.DUPLICATED, HttpStatus.CONFLICT);
  }
}
