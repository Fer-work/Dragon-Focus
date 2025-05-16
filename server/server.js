import dotenv from "dotenv";
import express from "express";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { connectToDatabase } from "./config/connection.js";
import routes from "./routes/index.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // __dirname here refers to the 'server' directory

// Read Firebase service account credentials from JSON file
// Consider making this path more robust
const credentialsPath = path.join(__dirname, "credentials.json"); // Assumes credentials.json is in the 'server' directory
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the frontend build directory
// Ensure this path matches where your client actually builds.
// If client is a sibling to server, and builds into client/build:
app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.use(routes); // This is your main router from routes/index.js

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Dragon Focus API Server listening on http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(`Failed to connect to database. Err: ${err}`);
  });
