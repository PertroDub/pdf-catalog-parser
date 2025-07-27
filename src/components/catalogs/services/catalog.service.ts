import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as puppeteer from 'puppeteer';
import * as pdfParse from 'pdf-parse';
import axios from 'axios';
import { Repository } from 'typeorm';
import { Catalog } from '@entities';
import { PAGE_LOAD_STRATEGY, CATALOG_URL, CATALOG_SELECTORS } from '@constants';
import { CatalogDOMData, CatalogParseResult } from '@interfaces';
import { CatalogParsedDto, CatalogDomDto } from '@dtos';

@Injectable()
export class CatalogsService {
  private readonly logger = new Logger(CatalogsService.name);

  constructor(
    @InjectRepository(Catalog)
    private readonly catalogRepo: Repository<Catalog>,
  ) {}

  async pullPdfCatalogs(): Promise<CatalogDOMData[]> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(CATALOG_URL, { waitUntil: PAGE_LOAD_STRATEGY });
    await page.waitForSelector(CATALOG_SELECTORS);

    const catalogs = await page.evaluate(this.extractCatalogData);
    const addedCatalogs: CatalogDOMData[] = [];

    await Promise.all(catalogs.map((cat) => this.processCatalog(cat, addedCatalogs)));

    await browser.close();

    this.logger.log(`🚀 Completed. Added ${addedCatalogs.length} catalogs.`);

    return addedCatalogs;
  }

  async parseCatalogPdf(id?: number): Promise<CatalogParseResult[]> {
    this.logger.log('🔍 Starting PDF parsing...');

    const catalogs = id
      ? await this.catalogRepo.find({ where: { id, parsedData: null } })
      : await this.catalogRepo.find({ where: { parsedData: null } });

    const parsedResults: CatalogParseResult[] = [];

    await Promise.all(catalogs.map((catalog) => this.parseSingleCatalog(catalog, parsedResults)));

    this.logger.log('🚀 Parsing completed.');

    return parsedResults;
  }

  private extractCatalogData(): CatalogDomDto[] {
    const items = Array.from(document.querySelectorAll('ul.catalogues-grid li'));
    return items
      .map((item) => {
        const nameEl = item.querySelector('h3 a');
        const name = nameEl?.textContent?.trim() || 'unknown';

        const linkEl = item.querySelector('a.pdf');
        const link = linkEl?.getAttribute('href') || '';

        const [startSelector, endSelector] = item.querySelectorAll('time');
        const start = startSelector?.getAttribute('datetime') || null;
        const end = endSelector?.getAttribute('datetime') || null;

        return { name, link, start, end };
      })
      .filter((c) => c.link.endsWith('.pdf'));
  }

  private async processCatalog(cat: CatalogDomDto, addedCatalogs: CatalogDOMData[]): Promise<void> {
    try {
      const expiringBy = cat.end ? new Date(cat.end) : null;

      const exists = await this.catalogRepo.findOne({ where: { name: cat.name, expiringBy } });

      if (!exists) {
        const catalog = this.catalogRepo.create({
          name: cat.name,
          link: cat.link,
          expiringBy,
        });

        await this.catalogRepo.save(catalog);

        addedCatalogs.push({
          name: cat.name,
          link: cat.link,
          validTo: expiringBy?.toISOString().split('T')[0] || null,
        });
      }
    } catch (err) {
      this.logger.error(`❌ Failed to process catalog "${cat.name}": ${err.message}`);
      throw new Error(`Failed to save catalog "${cat.name}"`);
    }
  }

  private async parseSingleCatalog(
    catalog: Catalog,
    parsedResults: CatalogParseResult[],
  ): Promise<void> {
    try {
      const response = await axios.get(catalog.link, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);
      const parsed = await pdfParse(buffer);

      const parsedData: CatalogParsedDto = {
        name: catalog.name,
        link: catalog.link,
        validUntil: catalog.expiringBy instanceof Date ? catalog.expiringBy.toISOString() : null,
        text: parsed.text,
      };

      catalog.parsedData = parsedData;

      await this.catalogRepo.save(catalog);

      parsedResults.push({
        id: catalog.id,
        parsed: catalog.parsedData,
      });
    } catch (error) {
      this.logger.error(`❌ Failed to parse PDF from "${catalog.link}": ${error.message}`);
      throw new Error(`Failed to parse PDF from "${catalog.link}"`);
    }
  }
}
