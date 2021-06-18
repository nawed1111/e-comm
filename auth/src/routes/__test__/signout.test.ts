import request from 'supertest';
import { app } from '../../app';

it('returns 401 on signing out if cookie is missing', async () => {
  await request(app).post('/api/users/signout').send({}).expect(401);
});

it('clears the cookie on signing out', async () => {
  const cookie = await global.signup();
  const response = await request(app)
    .post('/api/users/signout')
    .set('Cookie', cookie)
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
