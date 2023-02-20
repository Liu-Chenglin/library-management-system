import {IsPositive, IsString, Min} from "class-validator";

export class CreateBookDto {
    @IsString()
    title: string;
    @IsString()
    author: string;
    @IsString()
    publisher: string;
    @IsPositive()
    price: number;
    @IsString()
    status: string;
    @IsString()
    comment: string;
    @Min(0)
    lateFeePerDay: number;
}
