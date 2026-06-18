import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/shared/env/env';
import { AppError } from '@/shared/error';

interface TokenPayload {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}

export function ensureAdminAuthenticated(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw AppError.unauthorized('JWT token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET || 'fallback_secret') as TokenPayload;

    if (decoded.role !== 'admin') {
      throw AppError.forbidden('User does not have admin privileges');
    }

    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    return next();
  } catch (err) {
    throw AppError.unauthorized('Invalid JWT token');
  }
}
