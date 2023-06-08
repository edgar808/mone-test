import { Authorized, Body, CurrentUser, Get, HttpCode, JsonController, Post } from 'routing-controllers';
import { UserService } from '../services/user.service';
import { Service } from 'typedi';
import { HttpStatus } from '../modules/exception/HttpStatus';
import { UserCreteDto, UserLoginDto, UserLoginRespDto, UserRegisterRespDto, UserResp } from '../dto/UserDto';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

@Service()
@JsonController('/user')
export class UserController {

    constructor(private userService: UserService) {}

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    @ResponseSchema(UserRegisterRespDto)
    async register(@Body() body: UserCreteDto) {
        return await this.userService.register(body);
    }

    @Post('/login')
    @HttpCode(HttpStatus.CREATED)
    @ResponseSchema(UserLoginRespDto)
    async login(@Body() body: UserLoginDto) {
        return this.userService.login(body);
    }

    @Get('/info')
    @HttpCode(HttpStatus.OK)
    @ResponseSchema(UserResp)
    @Authorized([])
    @OpenAPI({ security: [ { bearerAuth: [] } ] })
    async getPersonalInfo(@CurrentUser() user: UserResp) {
        return this.userService.getPersonalInfo(user.id);
    }

}

