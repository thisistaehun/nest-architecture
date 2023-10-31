import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  private _errorCode: string;
  /**
   * Constructor for CustomException.
   * @param message - The error message.
   * @param errorCode - The custom error code.
   * @param statusCode - The HTTP status code.
   */
  constructor(message: string, errorCode: string, statusCode: number) {
    super(message, statusCode);
    this._errorCode = errorCode;
  }

  /**
   * Get the custom error code.
   * @returns The custom error code.
   */
  get errorCode(): string {
    return this._errorCode;
  }
}
