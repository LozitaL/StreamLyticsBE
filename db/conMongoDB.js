import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGO_URI;

let client;

export const getConnection = async () => {
 try {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
  }
  return client;
} catch (error) {
  console.error('Error connecting to MongoDB:', error);
  throw new Error('Failed to connect to MongoDB');
}
};

export const getDb = async (dbName = 'streamlytics') => {
  const client = await getConnection();
  return client.db(dbName);
};

export const closeConnection = async () => {
  if (client) {
    await client.close();
    client = null;
    console.log('MongoDB connection closed');
  }
};

export default getConnection;