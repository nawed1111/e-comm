import express from 'express';
import { Ticket } from '../models/ticket';
import createHttpError from 'http-errors';

const router = express.Router();

router.get('/api/tickets/:id', async (req, res, next) => {
  const ticketId = req.params.id;

  try {
    const bTicketExists = await Ticket.findById(ticketId);
    if (!bTicketExists) {
      throw new createHttpError.NotFound(
        `Ticket with id ${ticketId} doesn't exist`
      );
    }
    res.send(bTicketExists);
  } catch (error) {
    next(error);
  }
});

export { router as showTicket };
