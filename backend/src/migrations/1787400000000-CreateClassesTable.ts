import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClassesTable1787400000000 implements MigrationInterface {
  name = 'CreateClassesTable1787400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "classes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "class_id" character varying(20) NOT NULL, "grade_label" character varying(50) NOT NULL, "class_name" character varying(50) NOT NULL, "thumbnail_url" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_classes_class_id" UNIQUE ("class_id"), CONSTRAINT "PK_classes_id" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "classes"`);
  }
}