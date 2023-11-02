import { InputType, PickType } from '@nestjs/graphql';
import { User } from '../../../entities/user.entity';

@InputType()
export class SignUpInput extends PickType(User, ['email', 'phoneNumber']) {}
