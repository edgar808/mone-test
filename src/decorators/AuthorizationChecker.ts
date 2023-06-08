import { Action } from 'routing-controllers';
import { Environment } from '../config/Environment';
import { UserRepository } from '../repositories/user.repository';
import { getCustomRepository } from 'typeorm';
import { Helpers } from '../modules/helpers';
import { UserEntity } from '../entities/users/user.entity';
import { Request } from 'express';

const headerParse = async(request: Request) => {
    const token = request.headers[ 'authorization' ];
    if (!token) return {
        success: false 
    };
    const bearerToken = token.split(`${Environment.BearerTokenPrefix} `)[ 1 ];
    if (!bearerToken) return {
        success: false 
    };

    try {
        const  data: any  = Helpers.verifyJwt(bearerToken);
        const userRepository = getCustomRepository(UserRepository);
        const user = await userRepository.findOne(data.data.id);
        if (!user){
            return {
                success: false
            }
        }
        return { success: true , user };

    }catch(e){
        return {
            success: false
        }
    }
}

export const authorizationChecker = async (action: Action, roles: string[]): Promise<boolean> => {

    const result =  await headerParse(action.request);
    if (result.success) {
        const user = result.user as UserEntity;

        action.request.user = user ;
    }
    return result.success;
};
