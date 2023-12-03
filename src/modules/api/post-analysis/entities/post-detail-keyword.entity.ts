import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PostDetail } from './post-detail.entity';

@ObjectType()
@Entity({ name: 'post_detail_keyword' })
export class PostDetailKeyword extends CommonEntity {
  @Field(() => String, {
    description: '키워드 이름',
  })
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Field(() => [String], {
    description: '키워드가 포함된 형태소들',
  })
  @Column({ name: 'morphemes', type: 'varchar', length: 255 })
  morphemes: string[];

  @Field(() => Int, {
    description: '키워드 자체 빈도수',
  })
  @Column({ name: 'frequency', type: 'int' })
  frequency: number;

  @Field(() => Int, {
    description: '키워드가 붙은 형태소의 빈도수',
  })
  @Column({ name: 'morpheme_frequency', type: 'int' })
  morphemeFrequency: number;

  @ManyToOne(() => PostDetail, (postDetail) => postDetail.keywords, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_detail_id' })
  @Field(() => PostDetail, {
    description: '포스트 상세',
  })
  postDetail: PostDetail;

  constructor(partial: Partial<PostDetailKeyword>) {
    super();
    Object.assign(this, partial);
  }
}
