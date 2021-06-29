import express from 'express';
import { authorization } from '@nawedtickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', authorization, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      'ticket'
    );
    res.send(orders);
  } catch (error) {
    next(error);
  }
});

export { router as indexOrderRouter };
