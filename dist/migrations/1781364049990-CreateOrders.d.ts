import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateOrders1781364049990 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
