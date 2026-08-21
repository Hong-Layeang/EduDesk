import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateScoresTable1787600000000 implements MigrationInterface {
  name = 'CreateScoresTable1787600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."scores_subject_enum" AS ENUM('khmer', 'math', 'science', 'history', 'civics', 'pe')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."scores_period_type_enum" AS ENUM('monthly', 'semester1', 'semester2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "scores" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "student_id" uuid NOT NULL,
        "class_id" character varying(20) NOT NULL,
        "subject" "public"."scores_subject_enum" NOT NULL,
        "period_type" "public"."scores_period_type_enum" NOT NULL,
        "period_key" smallint NOT NULL DEFAULT 0,
        "score" numeric(4,2) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_score_unique_entry" UNIQUE ("student_id", "subject", "period_type", "period_key"),
        CONSTRAINT "PK_scores_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_scores_student_id" ON "scores" ("student_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_scores_class_id" ON "scores" ("class_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_scores_class_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_scores_student_id"`);
    await queryRunner.query(`DROP TABLE "scores"`);
    await queryRunner.query(`DROP TYPE "public"."scores_period_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."scores_subject_enum"`);
  }
}