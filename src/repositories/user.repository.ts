import { EntityRepository } from 'typeorm';
import { Service } from 'typedi';
import { Repository } from './BaseRepository';
import { UserEntity } from '../entities/users/user.entity';

@Service()
@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
