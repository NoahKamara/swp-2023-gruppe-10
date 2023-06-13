import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';


export class RequestLogger {
  constructor(private request: Request, public id: string = uuidv4()) {}

  info(message?: unknown, ...optionalParams: unknown[]): void {
    if (!optionalParams) {
      console.info(`${this.request.method} ${this.request.path} - [${this.id}] ${message}`, optionalParams);
    } else {
      console.info(`${this.request.method} ${this.request.path} - [${this.id}] ${message}`);
    }
  }

  error(message?: unknown, ...optionalParams: unknown[]): void {
    if (!optionalParams) {
      console.error(`${this.request.method} ${this.request.path} - [${this.id}] ${message}`, optionalParams);
    } else {
      console.error(`${this.request.method} ${this.request.path} - [${this.id}] ${message}`);
    }
  }

  warn(message?: unknown, ...optionalParams: unknown[]): void {
    if (!optionalParams) {
      console.warn(`${this.request.method} ${this.request.path} - [${this.id}] ${message}`, optionalParams);
    } else {
      console.warn(`${this.request.method} ${this.request.path} - [${this.id}] ${message}`);
    }
  }
}

export const injectLogging = (request: Request, response: Response, next: NextFunction): void => {
  const requestID = uuidv4().toUpperCase();

    // Log request info
  const logger = new RequestLogger(request, requestID);

  // Set Logger
  request.logger = logger;

  // Set request id
  response.set('X-REQUEST-ID', logger.id);

  // Continue request
  next();
};

// Inject Request ID
// Logs Request Method + Path at the beginning of every request
// Extend Request with id property
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      logger: RequestLogger;
    }
  }
}


