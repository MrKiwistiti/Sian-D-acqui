import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1757544376381 implements MigrationInterface {
    name = 'InitSchema1757544376381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1c964484b77a64e5e1189faa8e2"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_4b89940fbaf67e410200f955e0e"`);
        await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_5cb529e2676446f38dd23146daf"`);
        await queryRunner.query(`ALTER TABLE "founder" DROP CONSTRAINT "FK_55ccaef11c3e1f001adf5300d1f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ea512f051b040e041543f666e1"`);
        await queryRunner.query(`DROP INDEX "public"."ux_startup_api_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c2991f48bdb721caf515b67e49"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4e9e5d65fb45e0716c7628ab01"`);
        await queryRunner.query(`ALTER TABLE "external_sync" DROP CONSTRAINT "external_sync_entity_api_id_key"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_bfd073437d38ccf2866a6d6b44" ON "external_sync" ("entity", "api_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_bfd073437d38ccf2866a6d6b44"`);
        await queryRunner.query(`ALTER TABLE "external_sync" ADD CONSTRAINT "external_sync_entity_api_id_key" UNIQUE ("entity", "api_id")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4e9e5d65fb45e0716c7628ab01" ON "investor" ("api_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c2991f48bdb721caf515b67e49" ON "partner" ("api_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "ux_startup_api_id" ON "startup" ("api_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ea512f051b040e041543f666e1" ON "user" ("api_id") `);
        await queryRunner.query(`ALTER TABLE "founder" ADD CONSTRAINT "FK_55ccaef11c3e1f001adf5300d1f" FOREIGN KEY ("startupId") REFERENCES "startup"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news" ADD CONSTRAINT "FK_5cb529e2676446f38dd23146daf" FOREIGN KEY ("startupId") REFERENCES "startup"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_4b89940fbaf67e410200f955e0e" FOREIGN KEY ("investorId") REFERENCES "investor"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_1c964484b77a64e5e1189faa8e2" FOREIGN KEY ("founderId") REFERENCES "founder"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
