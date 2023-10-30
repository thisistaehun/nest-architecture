import { HttpStatus } from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ExceptionCode } from './exception.code';

export class ConflictCustomException extends CustomException {
  constructor(message = '리소스가 충돌되었습니다.') {
    super(message, ExceptionCode.CONFLICT, HttpStatus.CONFLICT);
  }
}
