import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateProductInput } from '../dto/create-product.input';
import { Product } from '../entity/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(input: CreateProductInput): Product {
    return this.productRepository.create(input);
  }

  async save(product: Product): Promise<Product> {
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      order: {
        price: 'ASC',
      },
    });
  }

  async searchByName(name: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
      relations: {
        paymentOrders: true,
      },
      order: {
        price: 'ASC',
      },
    });
  }

  async findByCode(code: string): Promise<Product> {
    return await this.productRepository.findOne({
      where: {
        code,
      },
      relations: {
        paymentOrders: true,
      },
    });
  }
}
