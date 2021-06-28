import { Listener, Subjects, TicketCreatedEvent } from '@nawedtickets/common';
import { Message } from 'node-nats-streaming';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = 'something';
  onMessage = (data: any, msg: Message) => {};
}
