import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import { AppError } from '../utils/app.error';

const permission = (
  requiredRoles: Array<'client' | 'worker' | 'admin' | 'lawyer'>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new AppError('User not authenticated.', 401));
      }

      const userId = req.user.userId;
      const user = await User.findById(userId);

      if (!user) {
        return next(new AppError('User not found.', 404));
      }

      const hasRole = requiredRoles.includes(user.role);

      if (hasRole) {
        return next();
      } else {
        return next(new AppError('You are not authorized.', 403));
      }
    } catch (error) {
      return next(error);
    }
  };
};

export { permission };
