import {IsOptional, IsString} from "class-validator";

export class UpdateBookDto {
    @IsString()
    @IsOptional()
    status: string;

    @IsString()
    @IsOptional()
    comment: string;
}