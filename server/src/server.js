import { db, connectToDb } from "./db.js";
import express from "express";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

const PORT = process.env.PORT || 3000;
dotenv.config({ path: '../server/.env' });
const app = express();

app.use(express.json());

app.post('/api/signup', async (req, res) => {
  const uid = req.body.uid;
  const tasks = req.body.tasks || [];

  try {
    // Create the user document with an empty "tasks" array
    const userDocument = { uid, tasks: [] };

    // Insert the user document into the "userTask" collection
    await db.collection('userTask').insertOne(userDocument);

    // Push tasks into the "tasks" array of the user document
    await db.collection('userTask').updateOne({ _id: userDocument._id }, { $push: { tasks: { $each: tasks } } });

    res.status(200).send('User and tasks stored successfully.');
  } catch (error) {
    console.error('Error storing user and tasks:', error);
    res.status(500).send('Error storing user and tasks.');
  }
});

connectToDb(() => {
  app.listen(PORT, () => {
    console.log("Server (Express and MongoDB) started on port", PORT);
  });
});
