import { Test, TestingModule } from '@nestjs/testing';
import { USER_QUERY_REPOSITORY } from '../../../../symbols';
import { UserQueryRepository } from '../cqrs/query/user.query.repository';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: UserQueryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_QUERY_REPOSITORY,
          useClass: jest.fn(() => ({
            findOne: jest.fn(),
            findAll: jest.fn(),
          })),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserQueryRepository>(USER_QUERY_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
