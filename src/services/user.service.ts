import { Service } from 'typedi';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { UserCreteDto, UserLoginDto } from '../dto/UserDto';
import { Types } from '../entities/users/types';
import { ErrorCode } from '../modules/exception/ErrorCode';
import { ErrorMessages } from '../modules/exception/ErrorMessages';
import { Exception } from '../modules/exception/Exception';
import { Helpers } from '../modules/helpers';
import { UserRepository } from '../repositories/user.repository';

@Service()
export class UserService {

    constructor(
        @InjectRepository()
        private readonly userRepository: UserRepository
        ) {}
    
    @Transactional()
    async register(data:UserCreteDto){
        await this.checkEmail(data.email)
        
        const { salt, password } = Helpers.generateHash(data.password);
        
        const user = await this.userRepository.save(
            {
                email:data.email,
                password,
                salt,
                username: data.email.split('@')[ 0 ]+'.'+ Date.now()
            }
        );

        const token = Helpers.generateToken({ id: user.id }, Types.ACCOUNT_VERIFY);
        
        return { token }
    }

    @Transactional()
    async login(data: UserLoginDto) {
        const user = await this.userRepository.findOne({email:data.email});
        if (!user) throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.InvalidCredentials });

        const check = await this.checkPassword(data.password, user.password);
        if (!check) throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.InvalidCredentials });

        const token = Helpers.generateToken({ id: user.id, type:Types.ACCESS }, Types.ACCESS);
        return { token };
    }

    @Transactional()
    async getPersonalInfo(userId: string) {
        const user = await this.userRepository.findOneOrFail(userId);
        return user;
    }

    private async checkEmail(email:string): Promise<void> {
        email  = email.toLowerCase()
        const checkEmail = await this.userRepository.findOne({ where:{ email } });
        if (checkEmail)
            throw new Exception(ErrorCode.BadRequestError, { error: ErrorMessages.EmailAlreadyExist });
    }

    private async checkPassword(password: string, hashedPassword:string): Promise<boolean> {
        return Helpers.checkPassword(password, hashedPassword);
    }
}
