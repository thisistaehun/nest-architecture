import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './typeorm/typeorm.module.options';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmModuleOptions)],
})
export class DatabaseModule {}
