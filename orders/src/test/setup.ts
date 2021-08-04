import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

jest.mock('../helpers/initialize/nats-client');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'afjnakdbcnkabjsdckj';
  process.env.PAYMENT_WINDOW_SECONDS = '900';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  const userId = mongoose.Types.ObjectId();
  const payload = {
    user: { id: userId, email: 'test@test.com' },
  };

  const options = {
    expiresIn: 300,
    issuer: 'Tester',
    audience: `${userId}`,
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!, options);
  const session = JSON.stringify({ jwt: token });
  const base64 = Buffer.from(session).toString('base64');
  return [`express:sess=${base64}`];
};
