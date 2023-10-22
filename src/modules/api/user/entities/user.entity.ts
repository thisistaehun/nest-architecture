import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Column, Entity } from 'typeorm';
import { LoginType } from '../type/login.type';
import { UserRole } from '../type/user.role';

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
  @Column({ name: 'nickname', type: 'varchar', length: 255, unique: true })
  nickname: string;

  @Field(() => String, { nullable: true })
  @Column({ name: 'password', type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Field(() => LoginType, { nullable: false, defaultValue: LoginType.EMAIL })
  @Column({
    name: 'login_type',
    type: 'enum',
    enum: LoginType,
    default: LoginType.EMAIL,
  })
  loginType: LoginType;

  @Field(() => UserRole, { nullable: false })
  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.FREE_USER,
  })
  role: UserRole;

  @Field(() => String, { nullable: true })
  @Column({ name: 'social_id', type: 'varchar', length: 255, nullable: true })
  socialId?: string;

  @Field(() => String, { nullable: true })
  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  phoneNumber?: string;
}
