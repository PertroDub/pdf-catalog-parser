import { Controller, Post, Query, ParseIntPipe } from '@nestjs/common';
import { CatalogsService } from '../services/catalog.service';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CatalogDOMData, CatalogParseResult } from '@interfaces';
import { CatalogDomDto, CatalogParsingResultDto } from '@dtos';

@ApiTags('Catalogs')
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Post('pull-pdf')
  @ApiOperation({
    summary: 'Pull PDF catalogs from external source',
    description:
      'Fetches and saves PDF catalogs from the external website. Extracts basic catalog information such as name, link, and validity dates.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved PDF catalogs',
    type: [CatalogDomDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred while fetching catalogs',
    schema: {
      properties: {
        message: { type: 'string', example: 'Failed to fetch catalogs' },
        error: { type: 'string', example: 'Network connection error' },
      },
    },
  })
  async pullPdf(): Promise<CatalogDOMData[]> {
    return this.catalogsService.pullPdfCatalogs();
  }

  @Post('parse-pdf')
  @ApiOperation({
    summary: 'Parse PDF catalogs content',
    description:
      'Processes PDF catalogs and extracts structured information including product details, prices, and discounts.',
  })
  @ApiQuery({
    name: 'id',
    type: Number,
    required: false,
    description:
      'Optional catalog ID to parse a specific catalog. If not provided, all unparsed catalogs will be processed.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully parsed PDF catalogs',
    type: [CatalogParsingResultDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error occurred while parsing PDFs',
    schema: {
      properties: {
        message: { type: 'string', example: 'Failed to parse PDF' },
        error: { type: 'string', example: 'Invalid PDF format' },
      },
    },
  })
  async parsePdf(
    @Query('id', new ParseIntPipe({ optional: true })) id?: number,
  ): Promise<CatalogParseResult[]> {
    return this.catalogsService.parseCatalogPdf(id);
  }
}
