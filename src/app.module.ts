import { Module } from '@nestjs/common';
import { DatabaseModule } from '@core';
import { CatalogsModule } from '@modules';

@Module({
  imports: [DatabaseModule, CatalogsModule],
})
export class AppModule {}
