import { IsDate, IsDefined, IsEmail, IsJWT, IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserCreteDto{
    @IsNotEmpty()
    @IsEmail()
    @IsDefined()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    @Matches('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')
    password!: string
}

export class UserLoginDto{
    @IsNotEmpty()
    @IsEmail()
    @IsDefined()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    @Matches('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')
    password!: string
}

export class UserRegisterRespDto{
    @IsJWT()
    token!:string
}

export class UserLoginRespDto {
    @IsJWT()
    token!:string
}

export class UserResp{
    @IsString()
    id!:string;

    @IsEmail()
    email!:string;

    @IsString()
    username!:string;

    @IsString()
    password!:string;

    @IsString()
    salt!:string;

    @IsDate()
    createdAt!:string;

    @IsDate()
    updatedAt!:string;

    @IsDate()
    deletedAt!:string;

}

