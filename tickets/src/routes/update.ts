import express from 'express';
import { ticketSchema } from '../helpers/validator/ticketV';
import { Ticket } from '../models/ticket';
import createHttpError from 'http-errors';
import { authorization } from '@nawedtickets/common';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../helpers/initialize/nats-client';

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

    if (ticket.orderId) {
      throw new createHttpError.Forbidden(
        'Ticket is reserved, cannot be modified.'
      );
    }

    await ticket.set(result).save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.json(ticket);
  } catch (error) {
    if (error.isJoi) error.status = 422;
    next(error);
  }
});

export { router as updateTicket };
