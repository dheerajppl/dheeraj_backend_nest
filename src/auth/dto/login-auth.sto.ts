import { IsEmail, IsString, Matches, MinLength } from "class-validator"

export class loginData{
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[0-9])/,{message: 'Password must contain at least one munber'})
    password: string;

}

