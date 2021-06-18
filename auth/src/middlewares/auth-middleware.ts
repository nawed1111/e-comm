import { Request, Response, NextFunction } from 'express';

import { verifyAccessToken } from '../helpers/jwt/jwt-helper';

interface UserPayload {
  user: {
    fname: string;
    lname: string;
    email: string;
    id: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload['user'];
    }
  }
}

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = (await verifyAccessToken(req.session?.jwt)) as UserPayload;
    req.currentUser = payload.user;

    next();
  } catch (err) {
    next(err);
  }
};
