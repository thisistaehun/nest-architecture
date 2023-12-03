import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Column, Entity } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType()
@Entity({ name: 'keyword_stat' })
export class SearchKeywordStat extends CommonBulkEntity {
  @Column({ name: 'monthlyPcQcCnt', type: 'int', default: 0, nullable: true })
  @Field(() => Number, {
    description: '한 달 동안 PC를 통해 해당 키워드가 검색된 횟수',
    nullable: true,
    defaultValue: 0,
  })
  monthlyPcQcCnt: number;

  @Column({
    name: 'monthlyMobileQcCnt',
    type: 'int',
    default: 0,
    nullable: true,
  })
  @Field(() => Number, {
    description: '한 달 동안 모바일 기기를 통해 해당 키워드가 검색된 횟수',
    nullable: true,
    defaultValue: 0,
  })
  monthlyMobileQcCnt: number;

  @Field(() => Number, {
    description:
      '한 달 동안 PC 사용자들이 이 키워드에 대한 검색 결과를 클릭한 횟수 평균',
    nullable: true,
    defaultValue: 0,
  })
  monthlyAvePcClkCnt: number;

  @Field(() => Number, {
    description:
      '한 달 동안 모바일 기기 사용자들이 이 키워드에 대한 검색 결과를 클릭한 횟수 평균',
    nullable: true,
    defaultValue: 0,
  })
  @Column({
    name: 'monthlyAveMobileClkCnt',
    type: 'decimal',
    default: 0,
    nullable: true,
  })
  monthlyAveMobileClkCnt: number;

  @Field(() => Number, {
    description:
      'PC 사용자들의 클릭률(클릭률은 검색된 횟수 대비 실제 클릭된 횟수의 비율)',
    nullable: true,
    defaultValue: 0,
  })
  @Column({
    name: 'monthlyAvePcCtr',
    type: 'decimal',
    default: 0,
    nullable: true,
  })
  monthlyAvePcCtr: number;

  @Field(() => Number, {
    description:
      '모바일 기기 사용자들의 클릭률(클릭률은 검색된 횟수 대비 실제 클릭된 횟수의 비율)',
    nullable: true,
    defaultValue: 0,
  })
  @Column({
    name: 'monthlyAveMobileCtr',
    type: 'decimal',
    default: 0,
    nullable: true,
  })
  monthlyAveMobileCtr: number;

  constructor(partial: Partial<SearchKeywordStat>) {
    super();
    Object.assign(this, partial);
  }
}
