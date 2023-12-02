import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { PostDetailKeyword } from './post-detail-keyword.entity';

@ObjectType()
@Entity({ name: 'post_detail' })
export class PostDetail extends CommonEntity {
  @Field(() => String, {
    description: '제목',
  })
  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Field(() => String, {
    description: '타겟 URL',
  })
  @Column({ name: 'target_url', type: 'varchar', length: 255 })
  targetUrl: string;

  @Field(() => String, {
    description: '내용',
  })
  @Column({ name: 'content', type: 'text' })
  content: string;

  @Field(() => Int, {
    description: '사진 개수',
  })
  @Column({ name: 'photo_count', type: 'int' })
  photoCount: number;

  @Field(() => Int, {
    description: '동영상 개수',
  })
  @Column({ name: 'video_count', type: 'int' })
  videoCount: number;

  @Field(() => [String], {
    description: '하단 태그',
  })
  @Column({ name: 'bottom_tags', type: 'simple-array' })
  bottomTags: string[];

  @Field(() => [String], {
    description: '본문 태그',
  })
  @Column({ name: 'content_tags', type: 'simple-array' })
  contentTags: string[];

  @OneToMany(() => PostDetailKeyword, (keyword) => keyword.postDetail)
  @Field(() => [PostDetailKeyword], {
    description: '포스트 키워드',
  })
  keywords: PostDetailKeyword[];

  constructor(partial: Partial<PostDetail>) {
    super();
    Object.assign(this, partial);
  }
}
