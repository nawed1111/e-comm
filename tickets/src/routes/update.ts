import express from 'express';
import { ticketSchema } from '../helpers/validator/ticketV';
import { Ticket } from '../models/ticket';
import createHttpError from 'http-errors';
import { authorization } from '@nawedtickets/common';

const router = express.Router();

router.put('/api/tickets/:id', authorization, async (req, res, next) => {
  const ticketId = req.params.id;

  try {
    const result = await ticketSchema.validateAsync(req.body);
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new createHttpError.NotFound(
        `Ticket with id ${ticketId} doesn't exist`
      );
    }

    if (ticket.userId !== req.currentUser?.id) {
      throw new createHttpError.Forbidden(
        'You are not allowed to modify this ticket'
      );
    }

    await ticket.set(result).save();

    res.json(ticket);
  } catch (error) {
    if (error.isJoi) error.status = 422;
    next(error);
  }
});

export { router as updateTicket };
