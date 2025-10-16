import { Request, Response, NextFunction } from "express";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const message = err instanceof Error ? err.message : "Unexpected error";
  const status = 500;
  res.status(status).json({ error: { message } });
}
