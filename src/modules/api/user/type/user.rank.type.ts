import { registerEnumType } from '@nestjs/graphql';

export enum UserRank {
  // 비인증
  UNAUTH = 'UNAUTH',

  // 일반 0
  NORMAL = 'NORMAL',

  // 입문자 1 ~ 5,000,000 (+5%)
  BEGINNER = 'BEGINNER',

  // 초심자 5,000,001 ~ 10,000,000 (+10%)
  AMATEUR = 'AMATEUR',

  // 중급자 10,000,001 ~ 25,000,000 (+15%)
  INTERMEDIATE = 'INTERMEDIATE',

  // 고급자 25,000,001 ~ 50,000,000 (+20%)
  ADVANCED = 'ADVANCED',

  // 전문가 50,000,001 ~ 100,000,000 (+25%)
  EXPERT = 'EXPERT',
}

registerEnumType(UserRank, {
  name: 'UserRank',
  description: '유저 랭크',
});
