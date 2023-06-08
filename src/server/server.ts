import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Express } from 'express';
import { Server } from 'http';
import { getMetadataArgsStorage, RoutingControllersOptions, useExpressServer } from 'routing-controllers';
import { Action } from 'routing-controllers';
import { ErrorHandlerMiddleware } from '../middlewares/error.handler.middleware';
import { currentUserChecker } from '../decorators/CurrentUserChecker';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { Environment } from '../config/Environment';
import  * as swaggerUi from 'swagger-ui-express';

import * as cors from 'cors';

/** CONTROLLERS **/

import { validationMetadatasToSchemas } from 'class-validator-jsonschema'

//@ts-ignore
import { defaultMetadataStorage  } from 'class-transformer/cjs/storage'
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';
import { authorizationChecker } from '../decorators/AuthorizationChecker';

export class ExpressServer {

  private server?: Express;
  public httpServer!: Server;
  private routingControllersOptions?: RoutingControllersOptions;

  /**
   * @param porti
   */
  public async setup(porti: number): Promise<Express> {

    const server = express();
    this.setupStandardMiddlewares(server);
    await this.setupSwaggerMiddlewares(server);
    await this.configureApiEndpoints(server);
    this.httpServer = this.listen(server, porti);
    this.server = server;

    return this.server;
  }

  /**
   * @param server
   * @param porti
   */
  public listen(server: Express, porti: number) {
    console.info(`Starting server on port ${porti}`);
    return server.listen(porti);
  }

  /**
   * @param server
   */
  setupStandardMiddlewares(server: Express): void {

    server.use(bodyParser.json());
    server.use(cors({ origin: '*' }));
    server.use(bodyParser.urlencoded({ extended: true }));
    // server.use(apiLimiter);
  }

  async setupSwaggerMiddlewares(server: Express): Promise<void> {

      const schemas = validationMetadatasToSchemas({
          classTransformerMetadataStorage: defaultMetadataStorage,
          refPointerPrefix: '#/components/schemas/'
      })

      const storage = getMetadataArgsStorage()
      const spec = routingControllersToSpec(storage, this.routingControllersOptions, {
          components: {
              schemas,
              securitySchemes: {
                  bearerAuth: {
                      scheme: 'bearer',
                      type: 'http',
                      bearerFormat: 'JWT'
                  }
              }
          },
          info: {
              description: 'Generated with `routing-controllers-openapi`',
              title: 'Mone API',
              version: '1.0.0'
          },
          servers: [
              {
                  url: `http://localhost:${Environment.ServerPort}/${Environment.apiPrefix}`,
                  description: 'local'
              }
          ]
      })

      server.use(
          `/${Environment.apiPrefix}/docs`,
          swaggerUi.serve,
          swaggerUi.setup(spec)
    );
  }

  public kill(): void {
    if (this.httpServer) this.httpServer.close();
  }

  /**
   * @param server
   */
  async configureApiEndpoints(server: Express): Promise<void> {

    useExpressServer(server, {
      authorizationChecker: (action: Action, roles: string[]) => authorizationChecker(action, roles),
      currentUserChecker: async (action: Action) => currentUserChecker(action),
      routePrefix: `/${Environment.apiPrefix}`,
      controllers: [
        //controlers
        UserController,
        AuthController
      ],
      middlewares: [ ErrorHandlerMiddleware ],
      interceptors: [ ResponseInterceptor ],
      defaultErrorHandler: false
    });
  }
}

