import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactional } from 'src/modules/infrastructure/transaction/transaction.decorator';
import { Repository } from 'typeorm';
import { TotalPoint } from '../point/entities/total-point.entity';
import { SignUpInput } from './dtos/sign-up/input/sign-up.input';
import { UpdateUserInput } from './dtos/update/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormUserRepo: Repository<User>,
    @InjectRepository(TotalPoint)
    private readonly ormTotalPointRepo: Repository<TotalPoint>,
  ) {}

  @Transactional()
  public async signUpTransaction<T extends SignUpInput>(
    input: T,
    cb?: (user: User) => Promise<void>,
  ): Promise<User> {
    const user = this.create(input);
    await this.save(user);
    const totalPoint = this.ormTotalPointRepo.create({
      user,
    });
    await this.ormTotalPointRepo.save(totalPoint);
    if (cb) {
      await cb(user);
    }
    return user;
  }

  private create<T extends SignUpInput>(input: T): User {
    const user = this.ormUserRepo.create(input);
    return user;
  }

  private save(user: User): Promise<User> {
    try {
      return this.ormUserRepo.save(user);
    } catch (error) {
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

  async update(code: string, input: UpdateUserInput): Promise<User> {
    const updateResult = await this.ormUserRepo.update(
      {
        code,
      },
      input,
    );
    if (updateResult.affected === 0) {
      throw new Error('해당하는 유저가 없습니다.');
    }

    return this.findOneByCode(code);
  }

  async softDelete(code: string): Promise<boolean> {
    await this.ormUserRepo.softDelete({
      code,
    });

    return true;
  }
}
