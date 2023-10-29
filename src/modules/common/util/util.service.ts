import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  public createRandomSixDigitNumber(): string {
    const randomNumber = Math.floor(Math.random() * 1000000);
    if (randomNumber < 100000) {
      return this.createRandomSixDigitNumber();
    }
    return randomNumber.toString();
  }
}
