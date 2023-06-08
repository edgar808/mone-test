import { Service } from 'typedi';

@Service()
export class AuthService {

    async checkAuth(){
        return { successMessage: 'Your successfully authenticate' }
    }
}
