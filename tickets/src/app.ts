import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';
import createHttpError from 'http-errors';
import cookieSession from 'cookie-session';

import { createTicketRouter } from './routes/new';
import { showTicket } from './routes/ticket';
import { showAllTickets } from './routes/index';
import { updateTicket } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(createTicketRouter);
app.use(showTicket);
app.use(updateTicket);
app.use(showAllTickets);

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
