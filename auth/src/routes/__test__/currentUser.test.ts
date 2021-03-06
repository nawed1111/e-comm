import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .get('/api/users/currentUser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(response.body.user.email).toEqual('test@test.com');
});

it('responds with unauthorized if not authenticated', async () => {
  await request(app).get('/api/users/currentUser').send().expect(401);
});
