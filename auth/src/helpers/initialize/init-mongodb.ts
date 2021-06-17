import mongoose from 'mongoose';

mongoose
  .connect('mongodb://auth-mongo-srv:27017/auth', {
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

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected...');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
