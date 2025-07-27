import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl, IsOptional, Matches } from 'class-validator';

export class BaseCatalogDto {
  @ApiProperty({
    description: 'Catalog name',
    example: 'AKCIJSKI KATALOG',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Link to PDF catalog file',
    example: 'https://www.tus.si/app/uploads/catalogues/catalog.pdf',
  })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  link: string;
}

export class CatalogParsedDto extends BaseCatalogDto {
  @ApiProperty({
    description: 'Catalog expiration date',
    example: '2025-07-29',
    nullable: true,
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  validUntil: string | null;

  @ApiProperty({
    description: 'Parsed catalog text content',
    example: 'SVINJSKI LAKS KARE\n• poreklo EU • postrežno \n• cena za 1 kg',
  })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class CatalogDomDto extends BaseCatalogDto {
  @ApiProperty({
    description: 'Catalog start date',
    example: '2025-07-23',
    nullable: true,
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  start: string | null;

  @ApiProperty({
    description: 'Catalog end date',
    example: '2025-07-29',
    nullable: true,
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
  end: string | null;
}

export class CatalogParsingResultDto {
  @ApiProperty({
    description: 'Catalog ID',
    example: 40,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'Parsed catalog data',
    type: CatalogParsedDto,
  })
  @IsNotEmpty()
  parsed: CatalogParsedDto;
}
