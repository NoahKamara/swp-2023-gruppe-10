import { z } from 'zod';
import { Request, Response } from 'express';
import { APIResponse } from '../models/response';

/**
 * validates the request body against the provided schema
 *
 * @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
 * @param {Request} req - express request
 * @param {Response} res - express response
 * @return {T | void} if the schema matches, returns the resulting object, otherwise return nothing and send error to client
 */
export const validateBody = <T>(
  req: Request,
  res: Response,
  schema: z.ZodSchema<T>
): T | void => {
  let body = req.body;

  if (!body) {
    body = {};
  }

  try {
    const validatedData = schema.parse(req.body);
    req.logger.info('validation succeeded');
    return validatedData;
  } catch (err) {
    req.logger.info('validation failed with error', err);

    if (err instanceof z.ZodError) {
      APIResponse.badRequest(err.flatten()).send(res);
    } else {
      APIResponse.internal('Validation failed with error that is not ZodError').send(res);
    }
  }
};
