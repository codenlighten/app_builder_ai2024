import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const url = process.env.MONGO_URI;
const dbName = "tempest_agritech_pilot_2024";

// Store the database connection
let _db;

export const mongoConnect = async () => {
  if (_db) {
    // Return the existing connection if already established
    return _db;
  }
  try {
    const client = await MongoClient.connect(url, { useUnifiedTopology: true });
    _db = client.db(dbName);
    return _db;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

export const connectCollection = async (collectionName) => {
  const db = await mongoConnect();
  return db.collection(collectionName);
};
