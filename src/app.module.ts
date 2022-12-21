import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { evnConfig } from './config/env.config';
import { JoiValidationSchema } from './config/joiValidationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [evnConfig],
      validationSchema: JoiValidationSchema,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      database: process.env.POSTGRES_NAME,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      autoLoadEntities: true,
      //  Automatic apply the schema changes
      // ! Do not use in production
      synchronize: process.env.NODE_ENV ? false : true,
    }),

    ProductsModule,

    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
