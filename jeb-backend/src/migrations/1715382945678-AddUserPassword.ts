import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcrypt";

export class AddUserPassword1715382945678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
      ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT FALSE NOT NULL
    `);

    const TEMP_PASSWORD = process.env.TEMP_PASSWORD || 'mdp123temp';
    const hash = await bcrypt.hash(TEMP_PASSWORD, 12);

    await queryRunner.query(`
      UPDATE "user"
      SET password_hash = $1,
          must_change_password = TRUE
      WHERE password_hash IS NULL OR TRIM(password_hash) = ''
    `, [hash]);

    await queryRunner.query(`
      ALTER TABLE "user"
      ALTER COLUMN password_hash SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      DROP COLUMN IF EXISTS password_hash,
      DROP COLUMN IF EXISTS must_change_password
    `);
  }
}
