import { Inject, Injectable } from '@nestjs/common';
import { ITypeORMCommandRepository } from 'src/interface/cqrs/command.repository.interface';
import { NotFoundCustomException } from 'src/modules/common/exception/not-found.exception';
import { Transactional } from 'src/modules/infrastructure/transaction/transaction.decorator';
import {
  TRANSACTION_MANAGER,
  TransactionManager,
} from 'src/modules/infrastructure/transaction/transaction.manager';
import { EntityManager } from 'typeorm';
import { PointTransaction } from '../../../point/entities/point-transaction.entity';
import { TotalPoint } from '../../../point/entities/total-point.entity';
import { SignUpInput } from '../../dto/sign-up/input/sign-up.input';
import { UpdateUserInput } from '../../dto/update/input/update-user.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserCommandRepository implements ITypeORMCommandRepository {
  constructor(
    @Inject(TRANSACTION_MANAGER)
    private readonly txManager: TransactionManager,
  ) {}
  /**
   *
   * @returns Transaction EntityManager
   */
  public txEntityManager(): EntityManager {
    return this.txManager.getEntityManager();
  }

  @Transactional()
  public async signUpTransaction<T extends SignUpInput>(
    input: T,
    cb?: (user: User) => Promise<void>,
  ): Promise<User> {
    const user = this.txEntityManager().create(User, input);
    await this.txEntityManager().save(User, user);
    const totalPoint = this.txEntityManager().create(TotalPoint, {
      user,
    });
    await this.txEntityManager().save(totalPoint);
    if (cb) {
      await cb(user);
    }
    return user;
  }

  @Transactional()
  async softDelete(
    code: string,
    cb?: (user: User) => Promise<void>,
  ): Promise<boolean> {
    const totalPoint = await this.txEntityManager().findOne(TotalPoint, {
      where: {
        user: {
          code,
        },
      },
    });
    const pointTransactions: PointTransaction[] =
      await this.txEntityManager().find(PointTransaction, {
        where: {
          totalPoint: {
            id: totalPoint.id,
          },
        },
      });

    for (const pointTransaction of pointTransactions) {
      await this.txEntityManager().softDelete(PointTransaction, {
        id: pointTransaction.id,
      });
    }
    await this.txEntityManager().softDelete(TotalPoint, {
      id: totalPoint.id,
    });
    await this.txEntityManager().softDelete(User, {
      code,
    });

    if (cb) {
      await cb(totalPoint.user);
    }

    return true;
  }

  @Transactional()
  async update(code: string, input: UpdateUserInput): Promise<User> {
    const updateResult = await this.txEntityManager().update(
      User,
      {
        code,
      },
      input,
    );
    if (updateResult.affected === 0) {
      throw new NotFoundCustomException('해당하는 유저가 없습니다.');
    }

    return this.txEntityManager().findOne(User, {
      where: {
        code,
      },
    });
  }
}
