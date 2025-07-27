import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753617012379 implements MigrationInterface {
  name = 'Migration1753617012379';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "catalogs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "link" character varying NOT NULL, "parsedData" jsonb, "expiringBy" date NOT NULL, CONSTRAINT "PK_1883399275415ee6107413fe6c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b9ff3acc84152e32a4f0fb08f4" ON "catalogs" ("name", "expiringBy") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_b9ff3acc84152e32a4f0fb08f4"`);
    await queryRunner.query(`DROP TABLE "catalogs"`);
  }
}
