import express from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req, res, next) => {
  console.log('Tickets!!!');
  try {
    const tickets = await Ticket.find({
      orderId: undefined,
    });

    res.send(tickets);
  } catch (error) {
    next(error);
  }
});

export { router as showAllTickets };
