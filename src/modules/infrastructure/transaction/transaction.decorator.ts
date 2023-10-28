import { getNamespace } from 'cls-hooked';
import { EntityManager } from 'typeorm';
import { TRANSACTION_MANAGER } from './transaction.manager';
import { TRANSACTION_NAMESPACE } from './transaction.middleware';

/**
 * @description 메서드 실행 시 트랜젝션을 걸어주는 데코레이터
 * 작동 방식
 * 1. 원래 메서드를 transactionWrapped로 감싼다.
 * 2. 트랜젝션을 걸어주는 방식은 cls-hooked에서 생성해주는 네임스페이스를 통해 트랜젝션 매니저를 세팅해주고 원래 메서드를 실행한다.
 */
export function Transactional() {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    // 1. 원래 메서드를 PropertyDescriptor.value로 가져온다.
    const originMethod = descriptor.value;

    // 2. 원래 메서드를 감싸줄 트랜젝션 메서드를 생성한다.
    async function transactionWrapped(...args: unknown[]) {
      // 3. 네임스페이스를 가져온다.
      const nameSpace = getNamespace(TRANSACTION_NAMESPACE);

      if (!nameSpace || !nameSpace.active)
        throw new Error('No active namespace found');

      // 4. 네임스페이스에 트랜젝션 매니저가 있는지 확인한다.
      const entityManager = nameSpace.get(TRANSACTION_MANAGER) as EntityManager;

      if (!entityManager) throw new Error('No active entityManager found');

      // 5. 트랜젝션을 걸어준다. (트랜젝션 매니저를 네임스페이스에 세팅해준다.)
      return entityManager.transaction(async (entityManager: EntityManager) => {
        nameSpace.set(TRANSACTION_MANAGER, entityManager);
        return originMethod.apply(this, args);
      });
    }

    // 6. 원래 메서드를 트랜젝션으로 랩핑된 메서드로 교체한다.
    descriptor.value = transactionWrapped;
  };
}
