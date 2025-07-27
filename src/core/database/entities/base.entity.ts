import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({
    name: 'createdAt',
    type: 'timestamptz',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamptz',
  })
  public updatedAt: Date;
}
