import { db, connectToDb } from "./db.js";
import express from "express";
import dotenv from "dotenv";

const PORT = process.env.PORT || 3000;
dotenv.config({ path: './server/src/.env' });
const app = express();

connectToDb(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server(Express And Mongo) started on port 3000");
  });
});



