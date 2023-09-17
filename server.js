import express from "express";
import {nanoid} from "nanoid";
import 'dotenv/config';

const app = express();
const taskData = [
  {
    title: "Assignment 1",
    date: "2023-09-15",
    priority: "Medium",
    description: "Webware assignment 1",
    dueDate: "2023-09-18",
    id: nanoid(),
  },
  {
    title: "Assignment 2",
    date: "2023-09-16",
    priority: "High",
    dueDate: "2023-09-18",
    description: "Webware assignment 2",
    id: nanoid(),
  },
];

app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());

app.listen(process.env.PORT);
