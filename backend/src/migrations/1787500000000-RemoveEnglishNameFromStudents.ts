import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveEnglishNameFromStudents1787500000000 implements MigrationInterface {
  name = 'RemoveEnglishNameFromStudents1787500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_students_english_name"`);
    await queryRunner.query(`ALTER TABLE "students" DROP COLUMN "english_name"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" ADD "english_name" character varying(100) NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_students_english_name" ON "students" ("english_name")`,
    );
  }
}