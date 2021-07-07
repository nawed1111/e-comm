import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import createHttpError from 'http-errors';
import cookieSession from 'cookie-session';

import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(createChargeRouter);

app.use((req, res, next) => {
  next(new createHttpError.NotFound());
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // console.error(err.stack);
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

export { app };
