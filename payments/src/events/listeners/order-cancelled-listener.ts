import {
  Listener,
  OrderCancelledEvent,
  Subjects,
  OrderStatus,
} from '@nawedtickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { id, version } = data;
    try {
      const order = await Order.findOne({ id, version });

      if (!order) {
        throw new Error('Order not found');
      }

      await order.set({ status: OrderStatus.Cancelled }).save();

      msg.ack();
    } catch (error) {
      console.error('Order cancelled listener :: order service', error.stack);
    }
  }
}
