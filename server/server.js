import dotenv from "dotenv";

import express from "express";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { connectToDatabase } from "./config/connection.js";
import routes from "./routes/index.js";

// Load environment variables from .env file
dotenv.config();

// This gets the current path file (since __filename isn't nativel available in ES modules)
const __filename = fileURLToPath(import.meta.url);

// This gets the current directory name of the file
const __dirname = path.dirname(__filename);

// Read Firebase service account credentials from JSON file
const credentials = JSON.parse(fs.readFileSync("./credentials.json"));

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, "dist")));

// For all non-API routes, serve teh frontend app's index.html
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use(routes);

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
