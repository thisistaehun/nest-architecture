import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/modules/infrastructure/auth/decorator/roles.decorator';
import { UserRole } from '../user/type/user.role';
import { CreateProductInput } from './dto/create-product.input';
import { Product } from './entity/product.entity';
import { ProductService } from './product.service';
import { CreateProductUsecase } from './usecase/create-product.usecase';

@Resolver()
export class ProductResolver {
  constructor(
    private readonly createProductUsecase: CreateProductUsecase,
    private readonly productService: ProductService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Mutation(() => Product, {
    description: '결제 상품 생성',
  })
  async createProduct(
    @Args('input') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return await this.createProductUsecase.execute(createProductInput);
  }

  @Roles(UserRole.UNAUTH_USER)
  @Query(() => [Product], {
    description: '결제 상품 목록 조회',
  })
  async products(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @Roles(UserRole.UNAUTH_USER)
  @Query(() => [Product], {
    description: '이름으로 결제 상품 목록 조회',
  })
  async productsByName(@Args('name') name: string): Promise<Product[]> {
    return await this.productService.searchByName(name);
  }
}
