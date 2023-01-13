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

      return this.sendResult();
    } catch (error) {
      this.logger.error(error);
      if (error.status === 401)
        throw new UnauthorizedException(error.response.message);

      return this.sendResult(error);
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

  private sendResult(error?: Error) {
    if (error) {
      throw new InternalServerErrorException({
        ok: false,
        message: 'Seed generation failed',
      });
    }

    return {
      ok: true,
      message: 'Seed generated successfully',
    };
  }
}
