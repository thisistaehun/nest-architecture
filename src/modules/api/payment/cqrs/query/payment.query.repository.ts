import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../product/entity/product.entity';

@Injectable()
export class PaymentQueryRepository {
  constructor(
    @InjectRepository(Product)
    private readonly paymentProductRepository: Repository<Product>,
  ) {}

  async findOneByCode(code: string): Promise<Product> {
    const product = await this.paymentProductRepository.findOne({
      where: {
        code,
      },
    });

    if (!product) {
      throw new Error('결제 상품이 존재하지 않습니다.');
    }

    return product;
  }
}
