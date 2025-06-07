import { IsEmail, IsString, Matches, MinLength } from "class-validator"

export class PostCreateDto {
    @IsString()
    title: string;

    @IsString()
    description: string;
}

