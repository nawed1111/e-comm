import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 if an invalid id is provided', async () => {
  const id = new mongoose.Types.ObjectId();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns ticket if a valid id is provided', async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'First Ticket',
      price: 100,
    });
  const id = response.body.id;
  await request(app).get(`/api/tickets/${id}`).send().expect(200);
});
