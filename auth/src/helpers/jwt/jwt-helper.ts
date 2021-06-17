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
      expiresIn: process.env.JWT_LIFE || 900,
      issuer: process.env.JWT_ISSUER || 'Innovation Mind',
      audience: user.email,
    };

    jwt.sign(
      payload,
      process.env.JWT_KEY ||
        'dsacaskcnakscbakadkjncvaisuhciowquhkabncsjkbqwibcqijkwbcqiwscba',
      options,
      (err, token) => {
        if (err) {
          reject(
            new createHttpError.InternalServerError(
              'Failed to generate token ' + err.message
            )
          );
        }
        resolve(token);
      }
    );
  });
};

export const verifyAccessToken = (token: string) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new createHttpError.Unauthorized('Bearer token is missing'));
    }

    jwt.verify(
      token,
      process.env.JWT_KEY ||
        'dsacaskcnakscbakadkjncvaisuhciowquhkabncsjkbqwibcqijkwbcqiwscba',
      (err, payload) => {
        if (err) {
          const message =
            err.name === 'JsonWebTokenError' ? 'Unathorised' : err.message;
          reject(new createHttpError.Unauthorized(message));
        }
        resolve(payload);
      }
    );
  });
};

export const signRefreshToken = (user: UserAttrs) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const options = {
      expiresIn: process.env.REFRESH_LIFE || 9000,
      issuer: process.env.JWT_ISSUER || 'Innovation Mind',
      audience: user.email,
    };

    jwt.sign(
      payload,
      process.env.JWT_KEY ||
        'dsacaskcnakscbakadkjncvaisuhciowquhkabncsjkbqwibcqijkwbcqiwscba',
      options,
      (err, token) => {
        if (err) {
          reject(
            new createHttpError.InternalServerError(
              'Failed to generate token ' + err.message
            )
          );
        }
        resolve(token);
      }
    );
  });
};
