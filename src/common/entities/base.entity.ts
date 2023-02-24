import {CreateDateColumn, DeleteDateColumn, UpdateDateColumn} from "typeorm";
import {Exclude} from "class-transformer";

export class BaseEntity {

    @CreateDateColumn()
    @Exclude()
    createdAt!: Date;

    @UpdateDateColumn()
    @Exclude()
    updatedAt!: Date;

    @DeleteDateColumn()
    @Exclude()
    deletedAt?: Date;
}
