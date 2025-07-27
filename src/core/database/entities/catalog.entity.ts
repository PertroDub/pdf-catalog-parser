import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ICatalogParsedData } from '../../../interfaces/catalogs/catalog-entity.interface';

@Entity('catalogs')
@Index(['name', 'expiringBy'])
export class Catalog extends BaseEntity {
  @Column()
  name: string;

  @Column()
  link: string;

  @Column({ type: 'jsonb', nullable: true })
  parsedData: ICatalogParsedData;

  @Column({ type: 'date' })
  expiringBy: Date;
}
