import { z } from 'zod';
import { Request, Response } from 'express';

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
  try {
    const validatedData = schema.parse(req.body);
    return validatedData;
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ errors: err.flatten() });
    } else {
      res.sendStatus(500);
    }
  }
};
