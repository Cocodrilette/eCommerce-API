import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(private readonly productsService: ProductsService) {}
  async runSeed() {
    try {
      const result = await this.insertNewProducts();

      if (result.status === 401)
        throw new UnauthorizedException({
          message: result.response,
        });

      return 'seed executed';
    } catch (error) {
      this.logger.error(error);
      if (error.status === 401)
        throw new UnauthorizedException(error.response.message);

      throw new InternalServerErrorException('Seed generation failed');
    }
  }

  private async insertNewProducts() {
    try {
      const res = await this.productsService.removeAll();

      const products = initialData.products;

      const insertPromises = [];

      products.forEach((product) => {
        insertPromises.push(this.productsService.create(product));
      });

      await Promise.all(insertPromises);

      return res;
    } catch (error) {
      return error;
    }
  }
}
