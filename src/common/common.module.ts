import { Module } from '@nestjs/common';
import { SlugParser } from './lib/slug';

@Module({
  providers: [SlugParser],
  exports: [SlugParser],
})
export class CommonModule {}
