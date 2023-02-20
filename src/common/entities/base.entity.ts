import {Column} from "typeorm";

export class BaseEntity {
    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column({nullable: true})
    createdBy: string;

    @Column({nullable: true})
    updatedBy: string;

    @Column({default: false})
    deleted: boolean;
}