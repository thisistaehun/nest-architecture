import { InputType, PickType } from '@nestjs/graphql';
import { SmartBlockKeyword } from '../../entities/smart-block/smart-block.keyword.entity';

@InputType()
export class SmartBlockKeywordSearchInput extends PickType(SmartBlockKeyword, [
  'bid',
  'desc',
]) {}
