import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPizzaAndIngredients1764847928542 implements MigrationInterface {
    name = 'AddPizzaAndIngredients1764847928542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ingredients" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "price" numeric(10,2) NOT NULL DEFAULT '0', "available" boolean NOT NULL DEFAULT true, "imageUrl" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a955029b22ff66ae9fef2e161f8" UNIQUE ("name"), CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pizzas" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "size" character varying NOT NULL DEFAULT 'medium', "available" boolean NOT NULL DEFAULT true, "imageUrl" character varying, "preparationTime" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9138d4819c8577c4805a029427f" UNIQUE ("name"), CONSTRAINT "PK_27f7ede7b9304d8372a336d1e5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pizza_ingredients" ("pizza_id" integer NOT NULL, "ingredient_id" integer NOT NULL, CONSTRAINT "PK_0a99ed754ccc2e75b8e4a3341a3" PRIMARY KEY ("pizza_id", "ingredient_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2a76e034bc72fe4142e314d409" ON "pizza_ingredients" ("pizza_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_028ed884726f34a71e8340c90b" ON "pizza_ingredients" ("ingredient_id") `);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" ADD CONSTRAINT "FK_2a76e034bc72fe4142e314d4095" FOREIGN KEY ("pizza_id") REFERENCES "pizzas"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" ADD CONSTRAINT "FK_028ed884726f34a71e8340c90bc" FOREIGN KEY ("ingredient_id") REFERENCES "ingredients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" DROP CONSTRAINT "FK_028ed884726f34a71e8340c90bc"`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" DROP CONSTRAINT "FK_2a76e034bc72fe4142e314d4095"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_028ed884726f34a71e8340c90b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a76e034bc72fe4142e314d409"`);
        await queryRunner.query(`DROP TABLE "pizza_ingredients"`);
        await queryRunner.query(`DROP TABLE "pizzas"`);
        await queryRunner.query(`DROP TABLE "ingredients"`);
    }

}
