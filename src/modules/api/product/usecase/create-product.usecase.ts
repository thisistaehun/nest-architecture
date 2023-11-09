import { Injectable } from '@nestjs/common';
import { CreateProductInput } from '../dto/create-product.input';
import { Product } from '../entity/product.entity';
import { ProductRepository } from '../repository/product.repository';

@Injectable()
export class CreateProductUsecase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(createProductInput: CreateProductInput): Promise<Product> {
    try {
      const product = this.productRepository.create(createProductInput);
      return await this.productRepository.save(product);
    } catch (error) {
      throw error;
    }
  }
}
