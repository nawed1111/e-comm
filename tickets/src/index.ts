import { app } from './app';
import { natsWrapper } from './helpers/initialize/nats-client';
import './helpers/initialize/init-mongodb';

natsWrapper
  .connect(
    process.env.NATS_CLUSTER_ID!,
    process.env.NATS_CLIENT_ID!,
    process.env.NATS_URL!
  )
  .then(() => {
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    app.listen(3000, () => {
      console.log(`Listening on port 3000`);
    });
  })
  .catch((err) => console.log('Error connecting to NATS...', err));
