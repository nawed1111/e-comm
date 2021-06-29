import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import createHttpError from 'http-errors';
import cookieSession from 'cookie-session';

const app = express();

import { showOrderRouter } from './routes/show';
import { updateOrderRouter } from './routes/update';
import { createOrderRouter } from './routes/new';
import { indexOrderRouter } from './routes/index';

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(updateOrderRouter);

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
