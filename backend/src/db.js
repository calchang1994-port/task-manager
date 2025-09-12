import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Missing MONGODB_URI in environment');
  process.exit(1);
}

mongoose.set('strictQuery', true);

mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'task_manager' })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
