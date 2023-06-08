import { db, connectToDb } from "./db.js";
import express from "express";
import dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log("hii");

const PORT = process.env.PORT || 3000;
dotenv.config({ path: path.join(__dirname, ".env") });
// dotenv.config({ path: '../server/.env' });
const app = express();

app.use(express.json());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   next();
// });

// app.use((req, res, next) => {
//   if (!req.url.endsWith(".js") && !req.url.endsWith(".css")) {
//     res.type("text/html");
//   }
//   next();
// });
// app.use((req, res, next) => {
//   if (req.url.endsWith(".js")) {
//     res.type("text/javascript");
//   }
//   next();
// });

// app.use(
//   "/assets",
//   express.static(path.join(__dirname, "..", "..", "client", "client/dist", "assets"))
// );
// app.use(express.static(path.join(__dirname, "..", "client", "dist")));

// app.get("/index-*.js", function (req, res) {
//   res.type("application/javascript");
//   res.sendFile(
//     path.join(__dirname, "..", "client", "dist", "assets", req.path)
//   );
// });

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

app.post('/api/user/AddTask', async (req, res) => {
  const userId = req.body.userId;
  const task = req.body.tasks;
  const taskId = uuidv4(); // Generate a unique task ID

  try {
    // Add the task ID to the task object
    task.taskId = taskId;

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


app.get('/api/user/tasks/lastSevenDays/Active', async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await db.collection('userTask').findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const nextSevenDays = new Date(yesterday.getTime() + 9 * 24 * 60 * 60 * 1000);

    const inProgressTasks = user.tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return task.status === 'Active' && dueDate >= yesterday && dueDate <= nextSevenDays;
    });

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

    // Iterate through tasks and group them by category
    for (const task of user.tasks) {
      const { category } = task;
      if (!tasksByCategory[category]) {
        tasksByCategory[category] = [];
      }
      tasksByCategory[category].push(task);
    }

    res.json(tasksByCategory);
  } catch (error) {
    console.error('Error fetching tasks by category:', error);
    res.status(500).json({ error: 'Failed to fetch tasks by category' });
  }
});

// Update in-progress tasks' status
app.put('/api/user/tasks/updateStatusToNotFinished', async (req, res) => {
  try {
    const userId = req.body.userId;

    // Find the user's tasks
    const userTasks = await db.collection('userTask').findOne({ uid: userId });

    if (!userTasks) {
      return res.status(404).json({ error: 'User tasks not found.' });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0); // Set the time to the start of yesterday

    const updatedTasks = Object.values(userTasks.tasks).map(task => {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0); // Set the time to the start of the day

      if (dueDate.getTime() <= yesterday.getTime()) {
        return { ...task, status: 'Not Finished' };
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


app.delete('/api/tasks/DeleteTask/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.query;
  try {
    const user = await db.collection('userTask').findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Find the task to be deleted
    const taskIndex = user.tasks.findIndex((task) => task.taskId === taskId);
    if (taskIndex === -1) {
      console.log("Task not found");
      return res.status(404).json({ error: 'Task not found' });
    }

    // Remove the task from the tasks array
    user.tasks.splice(taskIndex, 1);
    // Update the document in the database
    await db.collection('userTask').updateOne({ uid: userId }, { $set: user });

    res.sendStatus(200); // Send a success response to the client
  } catch (error) {
    console.error('Error deleting the task:', error);
    res.status(500).json({ error: 'Failed to delete the task' });
  }
});

app.put('/api/tasks/UpdateTask/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const userId = req.query.userId;
  const updatedTask = req.body;

  try {
    // Update the task in the user's document in the "userTask" collection
    await db.collection('userTask').updateOne(
      { uid: userId, 'tasks.taskId': taskId },
      { $set: { 'tasks.$[task]': updatedTask } },
      { arrayFilters: [{ 'task.taskId': taskId }] }
    );
    

    res.status(200).send('Task updated successfully.');
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send('Error updating task.');
  }
});

app.put('/api/tasks/CompleteTask/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { userId } = req.query;

  try {
    const user = await db.collection('userTask').findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the task to be marked as completed
    const task = user.tasks.find((task) => task.taskId === taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update the status of the task to "Completed"
    task.status = 'Done';

    // Update the user's document in the "userTask" collection
    await db.collection('userTask').updateOne(
      { uid: userId },
      { $set: { tasks: user.tasks } }
    );

    res.sendStatus(200); // Send a success response to the client
  } catch (error) {
    console.error('Error marking the task as completed:', error);
    res.status(500).json({ error: 'Failed to mark the task as completed' });
  }
});


app.get('/api/user/tasks/by-calendar', async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await db.collection('userTask').findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const tasks = user.tasks.map(task => ({
      taskName: task.taskName,
      title: task.taskName,
      start: task.dueDate,
      end: task.dueDate,
      dueDate: task.dueDate,
      category: task.category,
      importance: task.importance,
      comments: task.comments,
      status: task.status,
      taskId: task.taskId,
    }));

    // console.log('Tasks for user:', userId, tasks);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});
    
app.get('/api/user/profile', async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await db.collection('userTask').findOne({ uid: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});


