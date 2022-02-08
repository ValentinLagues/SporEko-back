import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';

class ErrorHandler extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
const handleError = (
  err: ErrorHandler,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { statusCode = 500, message } = err;
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message: message,
    });
};

/* eslint-enable @typescript-eslint/no-unused-vars */

export { ErrorHandler, handleError };
