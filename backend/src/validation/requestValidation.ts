import { ZodSchema, ZodError } from 'zod';
import { Request, Response } from 'express';

export const validateBody = <T>(req: Request, res: Response, schema: ZodSchema<T>): T | void => {
    try {
      const validatedData = schema.parse(req.body);
      return validatedData;
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ errors: err.flatten() });
      } else {
        res.sendStatus(500);
      }
    }
  };
  