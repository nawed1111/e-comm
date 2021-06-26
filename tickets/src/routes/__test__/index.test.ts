import request from 'supertest';
import { app } from '../../app';

const createTicket = async (body: { title: string; price: number }) => {
  await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send(body)
    .expect(201);
};

it('has a route handler listening to /api/tickets for get request', async () => {
  const response = await request(app).get('/api/tickets').send();

  expect(response.status).not.toEqual(404);
});

it('returns all tickets', async () => {
  await createTicket({ title: 'Ticket1', price: 100 });
  await createTicket({ title: 'Ticket2', price: 100 });
  await createTicket({ title: 'Ticket3', price: 100 });

  const response = await request(app).get('/api/tickets').send();

  expect(response.body.length).toEqual(3);
});
