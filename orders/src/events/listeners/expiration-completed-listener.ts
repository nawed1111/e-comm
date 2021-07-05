import {
  Listener,
  Subjects,
  ExpirationCompleted,
  OrderStatus,
} from '@nawedtickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { natsWrapper } from '../../helpers/initialize/nats-client';

export class ExpirationCompletedListener extends Listener<ExpirationCompleted> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleted['data'], msg: Message) {
    try {
      const order = await Order.findById(data.orderId).populate('ticket');
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status === OrderStatus.Complete) {
        return msg.ack();
      }

      await order.set({ status: OrderStatus.Cancelled }).save();

      await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
      });

      msg.ack();
    } catch (error) {
      throw error;
    }
  }
}
