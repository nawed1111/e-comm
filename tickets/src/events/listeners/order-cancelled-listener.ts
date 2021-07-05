import { Listener, OrderCancelledEvent, Subjects } from '@nawedtickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    try {
      const ticket = await Ticket.findById(data.ticket.id);

      if (!ticket) {
        throw new Error(`Could not find ticket`);
      }

      await ticket.set({ orderId: undefined }).save();

      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
        orderId: ticket.orderId,
      });

      msg.ack();
    } catch (error) {
      console.error('Order cancelled listener :: ticket service', error.stack);
    }
  }
}
