import { Injectable } from '@nestjs/common';
import { Product } from './entity/product.entity';
import { ProductRepository } from './repository/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async searchByName(name: string): Promise<Product[]> {
    return this.productRepository.searchByName(name);
  }

  async findByCode(code: string): Promise<Product> {
    return this.productRepository.findByCode(code);
  }

  async findAll() {
    return this.productRepository.findAll();
  }
}
