import { NextFunction, Request, Response } from "express";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  if (!error) {
    return res.status(statusCode).json({ error: "Internal server error" });
  }
  if (typeof error === "string") {
    return res.status(statusCode).json({ error });
  }
  statusCode = error.status || statusCode;
  res
    .status(statusCode)
    .json({ error: error.message || "Something went wrong" });
}
