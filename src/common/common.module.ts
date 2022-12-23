import { Module } from '@nestjs/common';
import { SlugParser } from './lib/slug';
import { ResponseParser } from './lib/response';
import { PaginationDto } from './dto/paginatio.dto';

@Module({
  providers: [SlugParser, ResponseParser, PaginationDto],
  exports: [SlugParser, ResponseParser, PaginationDto],
})
export class CommonModule {}
