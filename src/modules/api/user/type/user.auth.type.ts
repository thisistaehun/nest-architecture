import { PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

export class UserAuth extends PickType(User, [
  'email',
  'role',
  'code',
  'nickname',
]) {}
