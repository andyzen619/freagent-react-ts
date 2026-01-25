import type { Request, Response, NextFunction } from "express";
import { Logging } from "../lib/utils.js";

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  Logging.logHttpRequest(req);

  next();
}
