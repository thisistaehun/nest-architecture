import { ObjectType } from '@nestjs/graphql';
import { LoginOutput } from './login.output';

@ObjectType()
export class SocialLoginOutput extends LoginOutput {}
