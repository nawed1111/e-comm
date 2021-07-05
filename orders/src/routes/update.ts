import express from 'express';
import createHttpError from 'http-errors';

import { Order } from '../models/order';
import { authorization, OrderStatus } from '@nawedtickets/common';
import { natsWrapper } from '../helpers/initialize/nats-client';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = express.Router();

router.patch('/api/orders/:id', authorization, async (req, res, next) => {
  const orderId = req.params.id;
  try {
    const orderExists = await Order.findById(orderId).populate('ticket');

    if (!orderExists) {
      throw new createHttpError.NotFound('Order does not exist');
    }

    if (orderExists.userId !== req.currentUser!.id) {
      throw new createHttpError.Unauthorized(
        'Only owner can make changes to the order'
      );
    }

    orderExists.status = OrderStatus.Cancelled;
    await orderExists.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: orderExists.id,
      version: orderExists.version,
      ticket: {
        id: orderExists.ticket.id,
      },
    });

    res.send(orderExists);
  } catch (error) {
    next(error);
  }
});

export { router as updateOrderRouter };
