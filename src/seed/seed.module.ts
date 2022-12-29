import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from '../products/products.module';
import { ProductsService } from '../products/products.service';
import { CommonModule } from '../common/common.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [SeedController],
  providers: [SeedService, ProductsService],
  imports: [ProductsModule, CommonModule, ConfigModule],
})
export class SeedModule {}
