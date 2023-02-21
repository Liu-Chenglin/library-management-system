import {IsNotEmpty, IsPositive, IsString, Min} from "class-validator";

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    title: string;
    @IsString()
    @IsNotEmpty()
    author: string;
    @IsString()
    @IsNotEmpty()
    publisher: string;
    @IsPositive()
    @IsNotEmpty()
    price: number;
    @IsString()
    status: string;
    @IsString()
    comment: string;
    @Min(0)
    lateFeePerDay: number;
}
