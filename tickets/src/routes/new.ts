import express from 'express';
import createHttpError from 'http-errors';

const router = express.Router();

import { authorization } from '@nawedtickets/common';
import { Ticket } from '../models/ticket';
import { ticketSchema } from '../helpers/validator/ticketV';

router.post('/api/tickets', authorization, async (req, res, next) => {
  try {
    const result = await ticketSchema.validateAsync(req.body);
    const ticketExists = await Ticket.findOne({ title: result.title });
    if (ticketExists) {
      throw new createHttpError.Conflict(
        `Ticket with ${result.title} already exists`
      );
    }

    const newTicket = await Ticket.build({
      ...result,
      userId: req.currentUser?.id,
    }).save();

    res.status(201).send(newTicket);
  } catch (error) {
    if (error.isJoi) error.status = 422;
    next(error);
  }
});

export { router as createTicketRouter };
