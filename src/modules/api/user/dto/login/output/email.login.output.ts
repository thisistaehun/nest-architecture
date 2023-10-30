import { ObjectType } from '@nestjs/graphql';
import { LoginOutput } from './login.output';

@ObjectType()
export class EmailLoginOutput extends LoginOutput {}
