import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { uuid } from 'uuidv4';

@ObjectType()
export abstract class CommonEntity extends BaseEntity {
  constructor() {
    super();
    if (!this.code) this.generateCode();
  }

  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Field(() => String, {
    description: 'UUID code',
    nullable: false,
  })
  @Column({ name: 'code', type: 'varchar', length: 36 })
  @Index({ unique: true })
  code: string;

  @Field(() => GraphQLISODateTime, {
    description: '생성일',
    nullable: false,
  })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, {
    description: '수정일',
    nullable: true,
  })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  updatedAt: Date | null;

  @Field(() => GraphQLISODateTime, {
    description: '삭제일',
    nullable: true,
  })
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  deletedAt: Date;

  generateCode() {
    this.code = uuid();
  }
}
