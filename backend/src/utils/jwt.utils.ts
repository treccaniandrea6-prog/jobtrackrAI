import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../types/auth.types';

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT.SECRET, {
    expiresIn: env.JWT.EXPIRES_IN,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT.SECRET) as JwtPayload;
};
