import { Request, Response, NextFunction } from 'express';

import { verifyAccessToken } from '../helpers/jwt/jwt-helper';

interface UserPayload {
  aud: {
    fname: string;
    lname: string;
    email: string;
    id: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload['aud'];
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
    req.currentUser = payload.aud;
    next();
  } catch (err) {
    next(err);
  }
};
