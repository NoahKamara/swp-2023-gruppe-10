import { Response } from 'express';
import { ZodError } from 'zod';
import { APIError } from 'softwareproject-common';


export class APIResponse {

  constructor(public status: number, public data: unknown | null) {}

  public send(response: Response): void {
    response.status(this.status);
    if (!this.data) {
      response.send();
      return;
    }
    response.send(this.data);
  }

  static success(data: unknown | null = null): APIResponse {
    return new APIResponse(200, data);
  }

  private static error(status: number, data: APIError): APIResponse {
    return new APIResponse(status, data);
  }

  static failure(status: number, error: string, context: unknown | null = null): APIResponse {
    let data: APIError;

    if (!context) {
      data = {
        code: status,
        error: error
      };
    } else {
      data = {
        code: status,
        error: error,
        context: context
      };
    }

    return this.error(status, data);
  }

  static badRequest(context: unknown | null): APIResponse {
    return this.failure(400, 'Bad Request', context);
  }

  static notFound(context: unknown | null = null): APIResponse {
    return this.failure(404, 'Not Found', context);
  }

  static validationError(error: ZodError): APIResponse {
    return this.error(400, {
      code: 400,
      error: 'Validation Error',
      context: error
    });
  }

  static internal(context: unknown): APIResponse {
    return this.failure(500, 'Internal Server Error', context);
  }

  static unauthorized(context: string | null = null): APIResponse {
    return this.failure(401, 'Unauthorized', context);
  }
}
