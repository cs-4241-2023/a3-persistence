const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: String,
  taskDescription: String,
  priority: String,
  dueDate: Date,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
