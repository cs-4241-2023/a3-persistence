const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const mime = require('mime');
const fs = require('fs');
const dir = 'public/';
const port = process.env.PORT || 3000;

const app = express();

// Configure MongoDB connection using the MONGO_STRING environment variable
mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for tasks using Mongoose (you can modify this as needed)
const taskSchema = new mongoose.Schema({
  task: String,
  timestamp: Date,
});

// Create a model for tasks
const Task = mongoose.model('Task', taskSchema);

app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle POST requests to add tasks to the database
app.post('/tasks', async (req, res) => {
  const newTask = req.body;
  newTask.timestamp = new Date();

  try {
    const task = new Task(newTask);
    await task.save();
    res.status(200).send('Task added successfully');
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Error adding task');
  }
});

// Handle GET requests to retrieve tasks from the database
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Error fetching tasks');
  }
});

// Handle DELETE requests to delete tasks from the database
app.delete('/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findByIdAndDelete(taskId);
    if (task) {
      res.status(200).send('Task deleted successfully');
    } else {
      res.status(404).send('Task not found');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send('Error deleting task');
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
