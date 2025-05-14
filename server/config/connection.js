import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// The URI should ideally include the database name.
// If MONGODB_URI is "mongodb://localhost:27017", Mongoose will connect to the 'test' db by default.
// It's better to have it as "mongodb://localhost:27017/dragon-focus"
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/dragon-focus";

// Mongoose connection options
const mongooseOptions = {
  serverApi: {
    version: mongoose.mongo.ServerApiVersion.v1, // Access ServerApiVersion via mongoose.mongo
    strict: true,
    deprecationErrors: true,
  },
};

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    console.log("Already connected to MongoDB.");
    return;
  }

  try {
    // mongoose.connect() returns a Promise that resolves to the mongoose instance itself
    // upon successful connection.
    await mongoose.connect(uri, mongooseOptions);
    console.log(
      "Successfully connected to MongoDB database: dragon-focus using Mongoose"
    );

    // Optional: Listen for connection events
    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from MongoDB");
    });

    // When the Node process ends, close the Mongoose connection
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Mongoose connection disconnected due to app termination");
      process.exit(0);
    });
  } catch (error) {
    console.error(
      "Could not connect to MongoDB using Mongoose:",
      error.message
    );
    // Exit process with failure
    process.exit(1);
  }
}

export { connectToDatabase };
