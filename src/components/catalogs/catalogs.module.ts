import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogsController } from './controllers/catalog.controller';
import { CatalogsService } from './services/catalog.service';
import { Catalog } from '@entities';

@Module({
  imports: [TypeOrmModule.forFeature([Catalog])],
  controllers: [CatalogsController],
  providers: [CatalogsService],
})
export class CatalogsModule {}
