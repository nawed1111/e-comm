import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@nawedtickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, version, title, price } = data;
    try {
      const ticket = await Ticket.findByUpdateEvent({ id, version });
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      await ticket.set({ title, price }).save();

      msg.ack();
    } catch (error) {
      throw error;
    }
  }
}
