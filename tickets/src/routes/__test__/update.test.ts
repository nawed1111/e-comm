import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../helpers/initialize/nats-client';

it('has a route handler listening to /api/tickets/:id for put request', async () => {
  const id = new mongoose.Types.ObjectId();
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send();

  expect(response.status).not.toEqual(404);
});

it('returns unauthorized error if user is not the owner', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Testers',
      price: 100,
    })
    .expect(201);

  const id = response.body.id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'Testers updated', price: 9 })
    .expect(403);
});

it('updates the ticket with valid input and if user is the owner', async () => {
  const cookie = global.signin();
  let response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Testers',
      price: 100,
    })
    .expect(201);

  const id = response.body.id;
  const res = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'Testers updated', price: 9 });

  expect(res.body.title).toEqual('Testers updated');
  expect(res.body.price).toEqual(9);
});

it('publishes an event', async () => {
  const cookie = global.signin();
  let response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Testers',
      price: 100,
    })
    .expect(201);

  const id = response.body.id;
  const res = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'Testers updated', price: 9 });

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
