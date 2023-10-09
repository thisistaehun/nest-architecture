import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { uuid } from 'uuidv4';

export abstract class CommonEntity extends BaseEntity {
  constructor() {
    super();
    if (!this.code) this.generateCode();
  }

  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'code', type: 'varchar', length: 36 })
  @Index({ unique: true })
  code: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  updatedAt: Date | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  deletedAt: Date;

  @BeforeInsert()
  setCreatedAt() {
    this.updatedAt = null;
  }

  generateCode() {
    this.code = uuid();
  }
}
