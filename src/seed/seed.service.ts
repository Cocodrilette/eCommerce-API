import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}
  async runSeed() {
    try {
      const isSuccess = await this.insertNewProducts();
      if (!isSuccess) {
        throw new InternalServerErrorException();
      }
      return 'seed executed';
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Seed generation failed');
    }
  }

  private async insertNewProducts() {
    try {
      await this.productsService.removeAll();
      console.log('Products deleted');
      const products = initialData.products;

      const insertPromises = [];

      products.forEach((product) => {
        insertPromises.push(this.productsService.create(product));
      });

      await Promise.all(insertPromises);

      return true;
    } catch (error) {
      return false;
    }
  }
}
