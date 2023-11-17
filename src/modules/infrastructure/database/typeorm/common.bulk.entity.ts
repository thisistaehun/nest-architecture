import { ObjectType } from '@nestjs/graphql';
import { BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export abstract class CommonBulkEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: number;
}
