import mongoose from 'mongoose';

mongoose
  .connect(process.env.MONGODB_URI_ORDERS!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB...', err.message);
  });

mongoose.connection.on('disconnecting', () => {
  console.log('MongoDB disconnecting...');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
