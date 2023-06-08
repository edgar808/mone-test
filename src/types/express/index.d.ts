import { UserEntity } from "../../entities/users/user.entity";

declare global{
    namespace Express {
        interface Request {
            user: UserEntity;
        }
    }
}
