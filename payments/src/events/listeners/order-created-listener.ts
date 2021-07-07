import { Listener, OrderCreatedEvent, Subjects } from '@nawedtickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, userId, version, status } = data;
    try {
      const order = Order.build({
        id,
        userId,
        status,
        version,
        price: data.ticket.price,
      });

      await order.save();

      msg.ack();
    } catch (error) {
      console.error('Order created listener :: order service', error.stack);
    }
  }
}
