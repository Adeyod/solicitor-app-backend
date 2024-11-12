import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Response, Request, NextFunction } from 'express';
import { UserInJwt } from '../constants/types';
import { AppError, JwtError } from '../utils/app.error';
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET || '';

const generateAccessToken = async (userId: string, userEmail: string) => {
  try {
    const payload = {
      userId,
      userEmail,
    };

    const payload2 = {
      userId,
      unique: uuidv4(),
    };

    const access = await jwt.sign(payload2, jwtSecret, {
      expiresIn: '15days',
    });

    const token = await jwt.sign(payload, jwtSecret, {
      expiresIn: '15days',
    });

    const tokenObject = {
      access,
      token,
    };

    return tokenObject;
  } catch (error: any) {
    throw new JwtError(error.message, error.status);
  }
};

const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    let token;
    token = await req.cookies.token;

    if (!token) {
      const access = req.headers['authorization']?.split(' ')[1];

      if (!access) {
        throw new AppError('Please login to continue', 401);
      }
      token = access;
    }

    const user = (await jwt.verify(token, jwtSecret)) as UserInJwt;

    if (!user) {
      throw new AppError('Invalid token', 401);
    }
    req.user = user;

    next();
  } catch (error: any) {
    next(new JwtError(error.message, error.status));
  }
};

export { generateAccessToken, verifyAccessToken };
