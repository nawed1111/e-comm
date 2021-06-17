import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import createHttpError from 'http-errors';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signupRouter } from './routes/signup';
import { signoutRouter } from './routes/signout';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.use((req, res, next) => {
  next(new createHttpError.NotFound());
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

//connect to the database
import './helpers/initialize/init-mongodb';

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
