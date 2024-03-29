import { Injectable } from '@nestjs/common';

@Injectable()
export class PointCalculator {
  public sumPoint(a: number, b: number): number {
    return Number(a) + Number(b);
  }

  public subtractPoint(a: number, b: number): number {
    return Number(a) - Number(b);
  }
}
