import { z, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: {
            message: err.message,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any;
      }
      next(err);
    }
  };
}

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.query);
      res.locals.query = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: {
            message: err.message,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any;
      }
      next(err);
    }
  };
}
