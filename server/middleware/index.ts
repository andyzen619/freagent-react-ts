import type { Request, Response, NextFunction } from "express";
import { Logging } from "../utils/index.js";

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  Logging.logHttpRequest(req);

  next();
}
