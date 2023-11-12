import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserQueryRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormUserRepo: Repository<User>,
  ) {}

  public findAll(): Promise<User[]> {
    return this.ormUserRepo.find();
  }

  public findOneById(id: number): Promise<User> {
    return this.ormUserRepo.findOne({
      where: { id },
      relations: {
        userWallet: {
          pointTransactions: {
            paymentOrder: true,
          },
        },
      },
    });
  }

  public findOneByCode(code: string): Promise<User> {
    return this.ormUserRepo.findOne({
      where: { code },
      relations: {
        userWallet: {
          pointTransactions: {
            paymentOrder: true,
          },
        },
      },
    });
  }

  public findOneByEmail(email: string): Promise<User> {
    return this.ormUserRepo.findOne({
      where: { email },
      relations: {
        userWallet: {
          pointTransactions: {
            paymentOrder: true,
          },
        },
      },
    });
  }

  public findOneByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.ormUserRepo.findOne({
      where: { phoneNumber },
      relations: {
        userWallet: {
          pointTransactions: {
            paymentOrder: true,
          },
        },
      },
    });
  }

  findOneByNickname(nickname: string): Promise<User> {
    return this.ormUserRepo.findOne({
      where: { nickname },
      relations: {
        userWallet: {
          pointTransactions: {
            paymentOrder: true,
          },
        },
      },
    });
  }
}
