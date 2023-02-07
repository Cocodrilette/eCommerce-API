/**
 * An entity represents a table in the database
 */

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SlugParser } from '../../common/lib/slug';
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';

const slugParser = new SlugParser() as SlugParser;
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('float', { default: 0 })
  price: number;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { unique: true })
  slug: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', { nullable: false, array: true })
  sizes: string[];

  @Column('text', { nullable: false })
  gender: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true, // automatically load the relations from the database
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user: User;
  //
  @BeforeInsert()
  @BeforeUpdate()
  parseSlug() {
    this.slug = slugParser.parse(this.name);
  }
}
