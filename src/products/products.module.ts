import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '../common/common.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    /* ConfigModule, */ // No needed because is exported globally
    TypeOrmModule.forFeature([Product, ProductImage]),
    CommonModule,
  ],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
