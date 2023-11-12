import { UserRole } from 'src/modules/api/user/type/user.role';

export type AccessTokenPayload = {
  sub: string;
  email: string;
  nickname: string;
  role: UserRole;
  iat: number;
  exp: number;
};
