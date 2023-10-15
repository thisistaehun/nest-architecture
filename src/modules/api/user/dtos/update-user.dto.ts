import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { SignUpInput } from './sign-up.dto';

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(SignUpInput, ['name', 'email', 'password']),
) {}
