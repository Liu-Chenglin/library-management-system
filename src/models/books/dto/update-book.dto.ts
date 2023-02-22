import {IsString} from "class-validator";

export class UpdateBookDto {
    @IsString()
    status: string;
    @IsString()
    comment: string;
}