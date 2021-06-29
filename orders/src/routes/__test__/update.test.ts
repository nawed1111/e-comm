import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('updates an order with a valid id', async () => {
  const ticket = Ticket.build({
    title: 'Ticket1',
    price: 1,
  });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it.todo('publishes ticket:updated event');
