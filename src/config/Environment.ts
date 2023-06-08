import * as  path from 'path'
import * as envConfigs from 'dotenv';
import * as fs from 'fs';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

envConfigs.config({ path: path.resolve(__dirname, '../../.env') });

const srcDestinationDir = fs.existsSync('./build') ? 'build' : 'src'

export class Environment {

    public static readonly Env = process.env.ENV;
    
    public static readonly ServerPort = process.env.PORT || 8002;

    public static readonly apiPrefix = process.env.API_PREFIX || 'api';
    public static readonly BearerTokenPrefix = process.env.BEARER_PREFIC || 'Bearer';
    public static readonly schema = process.env.DB_SCHEMA;

    public static readonly TokenSecret = process.env.TOKEN_SECRET || 'TOKEN_SECRET';
    public static readonly AccessTokenLife = process.env.ACCESS_TOKEN_LIFE || '2h';
    public static readonly VerifyTokenLife = process.env.VERIFY_TOKEN_LIFE || '1d';
    public static readonly RefreshTokenLife = process.env.REFRESH_TOKEN_LIFE || '30d';
    public static readonly ForgotPasswordTokenLife = process.env.FORGOT_PASSWORD_TOKEN_LIFE || '1d';

    public static readonly BcryptGenSaltRounds = 10;

    public static get getPagination() {
        return {
            offset: 0,
            limit: 10
        }
    }

    public static getOrmPostgresConfig(): PostgresConnectionOptions {
        const res:any={
            type: 'postgres',
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            schema: process.env.DB_SCHEMA,
            synchronize: false,
            logging: true,
            entities: [ `${srcDestinationDir}/entities/**/*.*` ],
            migrations: [
                `${srcDestinationDir}/db/migrations/*.*`
            ],
            cli: {
                entitiesDir: `${srcDestinationDir}/entities/**/*.*`,
                migrationsDir: `${srcDestinationDir}/db/migrations`
            }
        }
        
        if(process.env.DB_SSL==='true')res.ssl={
            rejectUnauthorized: false
        }

        return res;
    }
}
