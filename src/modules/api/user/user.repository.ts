import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormUserRepo: Repository<User>,
  ) {}

  create(input: CreateUserInput): User {
    return this.ormUserRepo.create(input);
  }

  save(user: User): Promise<User> {
    return this.ormUserRepo.save(user);
  }

  findAll(): Promise<User[]> {
    return this.ormUserRepo.find();
  }

  findOneById(id: number): Promise<User> {
    return this.ormUserRepo.findOne({
      where: { id },
    });
  }

  findOneByCode(code: string): Promise<User> {
    return this.ormUserRepo.findOne({
      where: { code },
    });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.ormUserRepo.findOne({
      where: { email },
    });
  }
}
