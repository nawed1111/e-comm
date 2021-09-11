import { natsWrapper } from './helpers/initialize/nats-client';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

natsWrapper
  .connect(
    process.env.NATS_CLUSTER_ID!,
    process.env.NATS_CLIENT_ID!,
    process.env.NATS_URL!
  )
  .then(() => {
    console.log('expiration::');
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
  })
  .catch((err) => console.log('Error connecting to NATS...', err));
