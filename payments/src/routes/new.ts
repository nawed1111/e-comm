import express from 'express';
import createHttpError from 'http-errors';
import { authorization, OrderStatus } from '@nawedtickets/common';

import { paymentValidator } from '../helpers/validator/paymentV';

import { Order } from '../models/order';
import { Payment } from '../models/payment';

import { stripe } from '../services/stripe';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../helpers/initialize/nats-client';

const router = express.Router();

router.post('/api/payments', authorization, async (req, res, next) => {
  try {
    const result = await paymentValidator.validateAsync(req.body);
    const { token, orderId } = result;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new createHttpError.NotFound('Order not found');
    }
    if (order.userId !== req.currentUser!.id) {
      throw new createHttpError.Unauthorized();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new createHttpError.BadRequest('Order is already cancelled');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send(payment);
  } catch (error) {
    if (error.isJoi) error.status = 422;
    next(error);
  }
});

export { router as createChargeRouter };
