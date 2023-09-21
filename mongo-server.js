import express, { json } from "express";
import { nanoid } from "nanoid";
import { MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";

const app = express();

let taskData = [];

app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}`;
const client = new MongoClient(uri);

let collection = null;

// TODO need to have the data be pulled before anything else can happen (think i fixed this)
app.get("/init", async (req, res) => {
  await initDB();
  if (collection !== null) {
    const docs = await collection.find({}).toArray();
    taskData = docs;
  }
  res.json(taskData);
});

app.listen(process.env.PORT);

async function initDB() {
  await client.connect();
  collection = await client.db("whatToDo").collection("dev");
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  return;
}
