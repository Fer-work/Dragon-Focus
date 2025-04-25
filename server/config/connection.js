import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let db;

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dragon-focus";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  await client.connect();
  db = client.db("dragon-focus");
  console.log("Connected to MongoDB database: dragon-focus");
}

export { connectToDatabase, db };
