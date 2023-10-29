import { EntityManager } from 'typeorm';

export interface ITypeORMCommandRepository {
  txEntityManager(): EntityManager;
}
