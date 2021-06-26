import request from 'supertest';
import { app } from '../../app';

it('has a route handler listening to /api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({
    title: 'Test',
    price: 100,
  });

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is authenticated', async () => {
  await request(app)
    .post('/api/tickets')
    .send({
      title: 'Test',
      price: 100,
    })
    .expect(401);
});

it('returns a status code not 401 if the user is authenticated', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Test',
      price: 100,
    });
  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 100,
    })
    .expect(422);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Test',
      price: -1,
    })
    .expect(422);
});

it('created a ticket with valid inputs', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Testers',
      price: 100,
    })
    .expect(201);
});
