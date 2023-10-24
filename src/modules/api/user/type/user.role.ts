import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  PAID_USER = 'PAID_USER',
  FREE_USER = 'FREE_USER',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User Role',
});
