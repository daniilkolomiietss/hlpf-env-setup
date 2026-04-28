import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateUsers1777288268548 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
