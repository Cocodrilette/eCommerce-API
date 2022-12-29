import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { validate as isUUID } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ResponseParser } from '../common/lib/response';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ObjectParser } from '../common/lib/object';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsServices');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly responseParser: ResponseParser,
    private readonly configService: ConfigService,
    private readonly objectParser: ObjectParser,
  ) {}

  private readonly defaultLimit =
    this.configService.get<number>('defaultLimit');
  //
  // * CREATE
  //
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
  //
  // * FIND ALL
  //
  async findAll({ offset = 0, limit = this.defaultLimit }: PaginationDto) {
    try {
      const products = await this.productRepository.find({
        where: {},
        take: limit,
        skip: offset,
      });

      if (products.length === 0) throw new NotFoundException();

      return this.responseParser.successQuery(
        products,
        products.length,
        'Products',
      );
    } catch (error) {
      console.log(error);

      if (error.status === 404) {
        throw new NotFoundException('Product database empty');
      }

      throw new InternalServerErrorException(error);
    }
  }
  /**
   * * FIND ONE
   *
   * @param searchTerm Can be an UUID, represents the id of the product from the DB
   *                   or the product `name` or `slug`.
   * @returns One Product | NotFoundException | InternalServerErrorException
   */
  async findOne(searchTerm: string) {
    let product: Product;

    try {
      if (isUUID(searchTerm)) {
        product = await this.productRepository.findOneBy({
          id: searchTerm,
        });
      } else {
        product = await this.productRepository
          .createQueryBuilder('product')
          .where('UPPER(name) =:name or slug =:slug', {
            name: searchTerm.toUpperCase(),
            slug: searchTerm.toLowerCase(),
          })
          .getOne();
      }

      if (!product) throw new NotFoundException();

      return this.responseParser.successQuery(product, null, 'Product');
    } catch (error) {
      console.log(error);
      if (error.status === 404)
        throw new NotFoundException(`No matches found for: [ ${searchTerm} ]`);

      this.handleException(error);
    }
  }
  //
  // * UPDATE
  //
  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      /**
       * -> Find a product in the DTO
       * -> Keep the ID
       * -> Replace the properties passed through the `updateProductDto`
       */

      if (this.objectParser.isEmpty(updateProductDto))
        throw new BadRequestException();

      const product = await this.productRepository.preload({
        id,
        ...updateProductDto,
      });

      if (!product) throw new NotFoundException();

      /**
       * When updating - the entity `@BeforeInsert()` decorator will not be executed.
       * You need to parse the name explicitly by doing it like the line below
       */
      // product.slug = this.slugParser.parse(product.name);

      return this.responseParser.updatedSuccessfully(
        'Product',
        await this.productRepository.save(product),
        id,
      );
    } catch (error) {
      if (error.status === 404)
        throw new NotFoundException(`Product with id: [ ${id} ] not found`);

      if (error.status === 400)
        throw new BadRequestException(
          'You sent nothing to change. Please try again with some values to update',
        );

      this.handleException(error);
    }
  }
  //
  // * REMOVE
  //
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
