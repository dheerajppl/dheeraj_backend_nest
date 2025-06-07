import { IsEmail, IsString, Matches, MinLength } from "class-validator"

export class SignupAuthDto{
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/,{message: 'Password must contain at least one munber'})
    password: string;

    @IsString()
    name:string;
}

