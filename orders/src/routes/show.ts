import express from 'express';
import createHttpError from 'http-errors';
import { Order } from '../models/order';
import { authorization } from '@nawedtickets/common';

const router = express.Router();

router.get('/api/orders/:id', authorization, async (req, res, next) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new createHttpError.NotFound(`Order not found`);
    }

    if (order.userId !== req.currentUser!.id) {
      throw new createHttpError.Unauthorized();
    }

    res.send(order);
  } catch (error) {
    next(error);
  }
});

export { router as showOrderRouter };
