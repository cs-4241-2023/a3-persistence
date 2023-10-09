const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task: String, // Rename to 'task'
  description: String, // Rename to 'description'
  priority: String,
  dueDate: Date,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
