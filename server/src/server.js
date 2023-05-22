import { db, connectToDb } from "./db.js";
import express from "express";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

const PORT = process.env.PORT || 3000;
dotenv.config({ path: '../server/.env' });
const app = express();

app.use(express.json());


connectToDb(() => {
  app.listen(PORT, () => {
    console.log("Server (Express and MongoDB) started on port", PORT);
  });
});


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

app.post('/api/user/task', async (req, res) => {
  const userId = req.body.userId;
  const task = req.body.tasks;

  try {
    // Update the user's document in the "userTask" collection
    await db.collection('userTask').updateOne(
      { uid: userId },
      { $push: { tasks: task } }
    );

    res.status(200).send('Task stored successfully.');
  } catch (error) {
    console.error('Error storing task:', error);
    res.status(500).send('Error storing task.');
  }
});



app.get('/api/user/tasks/in-progress', async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await db.collection('userTask').findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const inProgressTasks = user.tasks.filter(task => task.status === 'In Progress');
    res.json(inProgressTasks);

  } catch (error) {
    console.error('Error fetching in-progress tasks:', error);
    res.status(500).json({ error: 'Failed to fetch in-progress tasks' });
  }
});


app.get('/api/user/tasks/by-category', async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await db.collection('userTask').findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const tasksByCategory = {};
    console.log('Tasks by category:', tasksByCategory);

    // Iterate through tasks and group them by category
    for (const task of user.tasks) {
      const { category } = task;
      if (!tasksByCategory[category]) {
        tasksByCategory[category] = [];
      }
      tasksByCategory[category].push(task);
    }

    console.log('Tasks by category:', tasksByCategory);
    res.json(tasksByCategory);
  } catch (error) {
    console.error('Error fetching tasks by category:', error);
    res.status(500).json({ error: 'Failed to fetch tasks by category' });
  }
});

// Update in-progress tasks' status
app.put('/api/user/tasks/update-status', async (req, res) => {
  try {
    const userId = req.body.userId;

    // Find the user's tasks
    const userTasks = await db.collection('userTask').findOne({ uid: userId });

    if (!userTasks) {
      return res.status(404).json({ error: 'User tasks not found.' });
    }

    const updatedTasks = Object.values(userTasks.tasks).map(task => {
      if (new Date(task.dueDate) < new Date()) {
        return { ...task, status: 'Completed' };
      }
      return task;
    });
    
    // Update the tasks in the user's document
    await db.collection('userTask').updateOne({ uid: userId }, { $set: { tasks: updatedTasks } });
    

    res.status(200).json({ message: 'Tasks updated successfully.' });
  } catch (error) {
    console.error('Error updating tasks:', error);
    res.status(500).json({ error: 'Failed to update tasks.' });
  }
});







