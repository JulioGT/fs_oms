import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export function validateBody(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: { message: err.errors.map((e) => e.message).join(", ") },
        });
      }
      return next(err);
    }
  };
}

export function validateQuery(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      // Avoid assigning to req.query (getter-only in Express 5)
      res.locals.query = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: { message: err.errors.map((e) => e.message).join(", ") },
        });
      }
      return next(err);
    }
  };
}
