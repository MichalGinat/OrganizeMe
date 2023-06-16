import { MongoClient } from "mongodb";
let db;

async function connectToDb(callback) {
    const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.0hqkipy.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);
    try {
      console.log("Connecting to the database...");
      await client.connect();
      console.log("Connected to the database!");
      db = client.db("Cluster0");
      callback();
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }


export { db, connectToDb };