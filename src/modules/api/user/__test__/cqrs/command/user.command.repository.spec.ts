import { Test, TestingModule } from '@nestjs/testing';
import { TRANSACTION_MANAGER } from 'src/modules/infrastructure/transaction/transaction.manager';
import { USER_COMMAND_REPOSITORY } from 'src/symbols';
import { UserCommandRepository } from '../../../repository/command/user.command.repository';

describe('UserCommandRepository', () => {
  let repository: UserCommandRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: USER_COMMAND_REPOSITORY,
          useClass: UserCommandRepository,
        },
        {
          provide: TRANSACTION_MANAGER,
          useClass: jest.fn(() => ({
            getEntityManager: jest.fn(),
          })),
        },
      ],
    }).compile();

    repository = module.get<UserCommandRepository>(USER_COMMAND_REPOSITORY);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
