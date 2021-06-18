import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

interface UserAttrs {
  fname: string;
  lname: string;
  email: string;
}

export const signAccessToken = (user: UserAttrs) => {
  return new Promise((resolve, reject) => {
    const payload = { user };
    const options = {
      expiresIn: parseFloat(process.env.JWT_LIFE!),
      issuer: process.env.JWT_ISSUER,
      audience: user.email,
    };

    jwt.sign(payload, process.env.JWT_KEY!, options, (err, token) => {
      if (err) {
        reject(
          new createHttpError.InternalServerError(
            'Failed to generate token ' + err.message
          )
        );
      }
      resolve(token);
    });
  });
};

export const verifyAccessToken = (token: string) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new createHttpError.Unauthorized('Bearer token is missing'));
    }

    jwt.verify(token, process.env.JWT_KEY!, (err, payload) => {
      if (err) {
        const message =
          err.name === 'JsonWebTokenError' ? 'Unathorised' : err.message;
        reject(new createHttpError.Unauthorized(message));
      }
      resolve(payload);
    });
  });
};

export const signRefreshToken = (user: UserAttrs) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const options = {
      expiresIn: parseFloat(process.env.REFRESH_LIFE!),
      issuer: process.env.JWT_ISSUER,
      audience: user.email,
    };

    jwt.sign(payload, process.env.REFRESH_KEY!, options, (err, token) => {
      if (err) {
        reject(
          new createHttpError.InternalServerError(
            'Failed to generate token ' + err.message
          )
        );
      }
      resolve(token);
    });
  });
};
