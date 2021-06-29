import express from 'express';
import createHttpError from 'http-errors';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { orderSchemaValidator } from '../helpers/validator/orderV';
import { OrderStatus } from '@nawedtickets/common';

import { authorization } from '@nawedtickets/common';

const router = express.Router();

router.post('/api/orders', authorization, async (req, res, next) => {
  const result = await orderSchemaValidator.validateAsync(req.body);

  try {
    const ticket = await Ticket.findById(result.ticketId);
    if (!ticket) {
      throw new createHttpError.NotFound(
        `Ticket with id ${result.ticketId} not found`
      );
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new createHttpError.BadRequest(`Ticket is already reserved`);
    }

    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + parseInt(process.env.PAYMENT_WINDOW_SECONDS!)
    );

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    res.status(201).send(order);
  } catch (error) {
    if (error.isJoi) error.status = 422;
    next(error);
  }
});

export { router as createOrderRouter };