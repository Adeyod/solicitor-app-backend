import { ErrorRequestHandler, Response, Request, NextFunction } from 'express';
import { AppError, JoiError, JwtError } from '../utils/app.error';

const isJoiError = (error: any): error is JoiError => {
  return error instanceof JoiError;
};

const appErrorHandler = (res: Response, error: AppError): void => {
  res.status(error.statusCode).json({
    success: false,
    status: error.statusCode,
    message: error.message,
  });
};

const jwtErrorHandler = (res: Response, error: JwtError): void => {
  const statusCode = error.statusCode || 401;
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: error.message,
    name: error.name,
  });
};

const joiErrorHandler = (res: Response, error: JoiError): void => {
  const statusCode = error.statusCode || 400;
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: error.message,
    type: error.type,
  });
};

export const errorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    appErrorHandler(res, error);
  } else if (error instanceof JwtError) {
    jwtErrorHandler(res, error);
  } else if (isJoiError(error)) {
    joiErrorHandler(res, error);
  } else {
    res.status(500).json({
      success: false,
      status: 500,
      message: error.message || 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};
