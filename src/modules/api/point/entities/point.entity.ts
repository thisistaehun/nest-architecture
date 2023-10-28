import { ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/modules/infrastructure/database/typeorm/common.entity';
import { Entity } from 'typeorm';

@Entity({ name: 'point' })
@ObjectType({ description: 'Point' })
export class Point extends CommonEntity {}
