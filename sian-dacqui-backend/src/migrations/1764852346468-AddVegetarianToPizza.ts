import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVegetarianToPizza1764852346468 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pizzas" ADD COLUMN "vegetarian" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pizzas" DROP COLUMN "vegetarian"
        `);
    }

}
