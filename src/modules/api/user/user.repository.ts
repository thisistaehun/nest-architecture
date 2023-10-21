import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpInput } from './dtos/sign-up/input/sign-up.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormUserRepo: Repository<User>,
  ) {}

  create<T extends SignUpInput>(input: T): User {
    const user = this.ormUserRepo.create(input);
    return user;
  }

  save(user: User): Promise<User> {
    try {
      return this.ormUserRepo.save(user);
    } catch (error) {
      console.log('hi');
      if (error.message.includes('Duplicate')) {
        throw new Error('이메일 또는 닉네임이 중복됩니다.');
      }
      throw error;
    }
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

  findOneByNickname(nickname: string): Promise<User> {
    return this.ormUserRepo.findOne({
      where: { nickname },
    });
  }
}
