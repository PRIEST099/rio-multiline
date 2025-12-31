import { MongoClient } from "mongodb";
import { config } from "./env.js";

let mongoClient;
let mongoDb;

export const getDb = async () => {
  if (!config.mongoUri) throw new Error("MONGODB_URI is not configured");
  if (mongoDb) return mongoDb;
  mongoClient = new MongoClient(config.mongoUri);
  await mongoClient.connect();
  mongoDb = mongoClient.db();
  return mongoDb;
};
