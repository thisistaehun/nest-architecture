import { registerEnumType } from '@nestjs/graphql';

export enum PostType {
  GENERAL = 'GENERAL',
  HIDDEN = 'HIDDEN',
}

registerEnumType(PostType, {
  name: 'PostType',
  description: '포스트 타입',
});
