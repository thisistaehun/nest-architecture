import { User } from 'src/modules/api/user/entities/user.entity';
import { CommonBulkEntity } from 'src/modules/infrastructure/database/typeorm/common.bulk.entity';
import { Entity, ManyToOne } from 'typeorm';
import { SearchKeyword } from './keyword.entity';

@Entity()
export class KeywordToUser extends CommonBulkEntity {
  @ManyToOne(() => SearchKeyword, (keyword) => keyword.keywordToUsers, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  keyword: SearchKeyword;

  @ManyToOne(() => User, (user) => user.keywordToUsers, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;

  constructor(partial: Partial<KeywordToUser>) {
    super();
    Object.assign(this, partial);
  }
}
