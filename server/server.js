import express from "express";
import path from "path";
import { connectToDatabase } from "./config/connection.js";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(process.cwd(), "client")));
}

app.use(routes);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Failed to connect to database. Err: ${err}`);
  });
