import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Column, Entity } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'keyword_item_content_tag' })
export class ViewSearchKeywordItemContentTag extends CommonBulkEntity {
  @Field(() => String, { nullable: true })
  @Column({ name: 'query', type: 'varchar', length: 255 })
  query: string;
}
