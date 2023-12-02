import { Field, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PostDetail } from './post-detail.entity';

@Entity({ name: 'shuffled_post' })
@ObjectType()
export class ShuffledPost extends CommonBulkEntity {
  @Field(() => String, {
    description: '셔플된 포스트 글',
  })
  @Column({ name: 'content', type: 'text' })
  content: string;

  @ManyToOne(() => PostDetail, (postDetail) => postDetail.shuffledPosts)
  postDetail: PostDetail;
}
