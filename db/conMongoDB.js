import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGO_URI;

let client;

export const getConnection = async () => {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
  }
  return client;
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