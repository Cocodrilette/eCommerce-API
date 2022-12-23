import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ResponseParser } from '../common/lib/response';
import { PaginationDto } from '../common/dto/paginatio.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsServices');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly responseParser: ResponseParser,
    private readonly configService: ConfigService,
  ) {}

  private readonly defaultLimit =
    this.configService.get<number>('defaultLimit');

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);

      await this.productRepository.save(product);

      return this.responseParser.createdSuccessfully(product, 'Product');
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(error.detail);
      }
      this.handleException(error);
    }
  }

  async findAll({ offset = 0, limit = this.defaultLimit }: PaginationDto) {
    console.log({ offset, limit });
    try {
      const products = await this.productRepository.find({
        where: {},
        take: limit,
        skip: offset,
      });

      return this.responseParser.successQuery(
        products,
        products.length,
        'Products',
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.productRepository.findOneBy({ id });
      if (!product) throw new NotFoundException();

      return this.responseParser.successQuery(product, null, 'Product');
    } catch (error) {
      console.log(error);
      if (error.status === 404)
        throw new NotFoundException(`Product with the id ${id} not found`);

      this.handleException(error);
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    try {
      const product = await this.productRepository.findOneBy({ id });
      if (!product)
        return new NotFoundException(`Product with the id ${id} not found`);

      await this.productRepository.remove(product);

      return this.responseParser.deletedSuccessfully('Product', id);
    } catch (error) {
      this.handleException(error);
    }
  }

  private handleException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error');
  }
}
