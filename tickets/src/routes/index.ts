import express from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req, res, next) => {
  try {
    const tickets = await Ticket.find();

    res.send(tickets);
  } catch (error) {
    next(error);
  }
});

export { router as showAllTickets };
