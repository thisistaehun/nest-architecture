import { registerEnumType } from '@nestjs/graphql';

export enum LoginType {
  GOOGLE = 'GOOGLE',
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
  EMAIL = 'EMAIL',
}
registerEnumType(LoginType, {
  name: 'LoginType',
  description: '로그인 타입(구글, 카카오, 네이버, 이메일)',
});
