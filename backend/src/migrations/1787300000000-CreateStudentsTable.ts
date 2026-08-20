import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudentsTable1787300000000 implements MigrationInterface {
  name = 'CreateStudentsTable1787300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."students_gender_enum" AS ENUM('male', 'female')`,
    );
    await queryRunner.query(
      `CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "khmer_name" character varying(100) NOT NULL, "english_name" character varying(100) NOT NULL, "gender" "public"."students_gender_enum" NOT NULL, "class_id" character varying(20) NOT NULL, "class_name" character varying(50) NOT NULL, "roll_number" character varying(20) NOT NULL, "avatar_url" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_students_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_students_class_id" ON "students" ("class_id")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_students_english_name" ON "students" ("english_name")`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_students_khmer_name" ON "students" ("khmer_name")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_students_khmer_name"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_students_english_name"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_students_class_id"`);
    await queryRunner.query(`DROP TABLE "students"`);
    await queryRunner.query(`DROP TYPE "public"."students_gender_enum"`);
  }
}