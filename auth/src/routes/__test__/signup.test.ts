import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on succesful signup', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      fname: 'test',
      lname: 'test',
      password: 'password',
    })
    .expect(201);
});

it('returns a 422 with an invalid email', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example',
      fname: 'test',
      lname: 'test',
      password: 'password',
    })
    .expect(422);
});

it('returns a 422 with an invalid password', () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      fname: 'test',
      lname: 'test',
      password: 'pass',
    })
    .expect(422);
});

it('returns a 422 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      fname: 'test',
      lname: 'test',
      email: 'test@test.com',
    })
    .expect(422);

  await request(app)
    .post('/api/users/signup')
    .send({
      fname: 'test',
      lname: 'test',
      password: 'password',
    })
    .expect(422);
});

it('does not allow duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      fname: 'test',
      lname: 'test',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      fname: 'test',
      lname: 'test',
      password: 'password',
    })
    .expect(409);
});

it('sets a cookie after succesful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      fname: 'test',
      lname: 'test',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
