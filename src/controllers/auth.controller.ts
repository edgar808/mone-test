import { Authorized, HttpCode, JsonController, Get } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { AuthCheckRespDto } from '../dto/AuthDto';
import { HttpStatus } from '../modules/exception/HttpStatus';
import { AuthService } from '../services/auth.service';

@Service()
@JsonController('/auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    @ResponseSchema(AuthCheckRespDto)
    @Authorized([])
    @OpenAPI({ security: [ { bearerAuth: [] } ] })
    async checkAuth() {
        return this.authService.checkAuth();
    }
}

