import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import statusCode from 'http-status-codes';

function zodValidationMiddleware(schema: z.ZodObject<any, any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: issue.message,
          field: issue.path.join('.'),
        }));
        return res
          .status(statusCode.BAD_REQUEST)
          .json({ error: errorMessages });
      }

      next(error);
    }
  };
}

export default zodValidationMiddleware;
