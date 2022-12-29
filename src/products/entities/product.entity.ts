/**
 * An entity represents a table in the database
 */

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SlugParser } from '../../common/lib/slug';

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

  @BeforeInsert()
  @BeforeUpdate()
  parseSlug() {
    this.slug = slugParser.parse(this.name);
  }
}
