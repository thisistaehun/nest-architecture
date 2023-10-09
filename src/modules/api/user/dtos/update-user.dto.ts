import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.dto';

@InputType()
export class UpdateUserInput extends PartialType(
  PickType(CreateUserInput, ['name', 'email', 'password']),
) {}
