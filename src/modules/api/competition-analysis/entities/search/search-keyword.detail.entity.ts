import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { SearchKeywordItem } from './search-keyword-item.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class SearchKeywordDetail extends CommonBulkEntity {
  @Field(() => Number, {
    description: '인용문 개수',
    nullable: true,
  })
  @Column({ name: 'quotations', type: 'int', default: 0, nullable: true })
  quotations: number;

  @Field(() => Number, {
    description: '장소 맵 개수',
    nullable: true,
  })
  @Column({ name: 'places_map', type: 'int', default: 0, nullable: true })
  placesMap: number;

  @Field(() => Number, {
    description: '내용 글자 수',
    nullable: true,
  })
  @Column({ name: 'contents', type: 'int', default: 0, nullable: true })
  contents: number;

  @Field(() => Number, {
    description: '공백 제거 내용 글자 수',
    nullable: true,
  })
  @Column({
    name: 'contents_without_blanks',
    type: 'int',
    default: 0,
    nullable: true,
  })
  contentsWithoutBlanks: number;

  @Field(() => Number, {
    description: '좋아요 개수',
    nullable: true,
  })
  @Column({ name: 'likes', type: 'int', default: 0, nullable: true })
  likes: number;

  @Field(() => Number, {
    description: '태그 개수',
    nullable: true,
  })
  @Column({ name: 'tags', type: 'int', default: 0, nullable: true })
  tags: number;

  @Field(() => Number, {
    description: '댓글 개수',
    nullable: true,
  })
  @Column({ name: 'replies', type: 'int', default: 0, nullable: true })
  replies: number;

  @OneToOne(() => SearchKeywordItem, (keywordItem) => keywordItem.detail, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'keyword_item_id' })
  keywordItem: SearchKeywordItem;

  constructor(partial: Partial<SearchKeywordDetail>) {
    super();
    Object.assign(this, partial);
  }
}
