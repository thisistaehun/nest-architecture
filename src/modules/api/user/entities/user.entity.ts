import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Column, Entity } from 'typeorm';

@InputType({ isAbstract: true })
@ObjectType({ description: 'User' })
@Entity({ name: 'user' })
export class User extends CommonEntity {
  @Field(() => String, { nullable: false })
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Field(() => String, { nullable: false })
  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Field(() => String, { nullable: false })
  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Field(() => Int, { nullable: false })
  @Column({ name: 'point', type: 'int', default: 0 })
  point: number;
}
