import { db, connectToDb } from "./db.js";
import express from "express";
import dotenv from "dotenv";

const PORT = process.env.PORT || 3000;
dotenv.config({ path: './server/src/.env' });
const app = express();

connectToDb(() => {
  app.listen(PORT, () => {
    console.log("Server (Express and Mongo) started on port 3000");
  });
});

app.get('/api', (req, res) => {
  console.log(`Request received from port 3000`);
  res.json({ "users": ["userOne", "userTwo"] });
});

app.listen(PORT, () => {
  console.log(`Server listening on port 3000`);
});
