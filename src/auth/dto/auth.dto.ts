import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";


export class AuthDto {
    @IsOptional()
    @IsEmail()
    email:string

    @MinLength(6, {message:'Password must be at least 6 characters long'})
    @IsString()
    password:string

    @IsString()
    name:string

    @IsOptional()
    avatar:string

    @IsOptional()
    phone:string
}


export class AuthLoginDto {
    @IsString()
    email:string

    @IsString()
    password:string
}