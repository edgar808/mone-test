import { IsString } from 'class-validator';

export class AuthCheckRespDto{
    @IsString()
    successMessage!: string
}
