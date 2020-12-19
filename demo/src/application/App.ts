import { Server, Errors } from 'typescript-rest';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import express, {
  Application,
  Handler,
  Request,
  Response,
  NextFunction
} from 'express';

import Constants from '@common/Constants';
import Computed from '@common/Computed';
import Logger from '@common/Logger';

import Types from '@types';
import Utils from '@utils';

/**
 * Main server application class.
 */
export default class App {
  private host: string = Constants.DEFAULT_HOST;

  private port: number = Constants.DEFAULT_PORT;

  private server: Types.Nullable<http.Server> = null;

  public constructor(private readonly app: Application = express()) {
    this.resolveHost();
    this.resolvePort();
    this.applyMidlewares();
    this.applyControllers();
    this.applyErrorHandler();

    if (process.env.NODE_ENV === 'development') {
      this.applyDevStuff();
    }
  }

  /**
   * Start the application.
   */
  public async start(): Promise<any> {
    return new Promise<any>((resolve) => {
      this.server = this.app.listen(this.port, this.host, () => {
        Logger.ifdev()?.log(`Listening to http://127.0.0.1:${this.port}`);
        return resolve();
      });
    });
  }

  /**
   * Stop the application.
   */
  public async stop(): Promise<any> {
    return new Promise<any>((resolve) => {
      this.server?.close();
      return resolve();
    });
  }

  /**
   * If a valid environment variable for the host is provided
   * then use it.
   */
  private resolveHost(): void {
    if (process.env.HOST) {
      this.host = process.env.HOST as string;
    }
  }

  /**
   * If a valid environment variable for the port is provided
   * then use it.
   */
  private resolvePort(): void {
    const maybePort = process.env.PORT;
    if (Utils.isString(maybePort)
      && Utils.isValidNumber(maybePort as string)) {
      this.port = parseInt(maybePort as string, 10);
    }
  }

  /**
   * Plug in extensions for the application.
   */
  private applyMidlewares(): void {
    // Cross-Origin Resource Sharing.
    this.app.use(cors() as Types.CorsMiddleware);

    // Provide functionality to read POST data.
    this.app.use(bodyParser.json());

    // Provide functionality to read cookies.
    this.app.use(cookieParser());
  }

  /**
   * Apply IoC REST controllers.
   */
  private applyControllers(): void {
    const controllersDir = `${Computed.ROOT_DIR}/controllers`;
    Server.loadControllers(this.app, `${controllersDir}/**/*.js`, __dirname);
  }

  /**
   * Apply JSON error handler.
   */
  private applyErrorHandler(): void {
    this.app.use((
      error: any, _: Request, response: Response, advance: NextFunction
    ) => {
      if (error instanceof Errors.HttpError) {
        // Important to allow default error handler to close connection
        // if headers already sent.
        if (response.headersSent) {
          return advance(error);
        }

        response.set('Content-Type', 'application/json');
        response.status(error.statusCode);
        response.json({ error: error.message, code: error.statusCode });
      }

      return advance(error);
    });
  }

  /**
   * Apply development-only stuff.
   */
  public applyDevStuff(): void {
    // Development logging.
    this.app.use(morgan('dev') as Handler);

    // Interactive API documenting.
    Server.swagger(this.app, { filePath: './dist/swagger.yaml' });
  }
}
