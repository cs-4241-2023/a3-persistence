const express = require('express');
const fs = require('fs');
const mime = require('mime');
const path = require('path');

const app = express();
const port = 3000;

let tasks = [];

app.use(express.json()); // Middleware to parse JSON request bodies

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for: ${req.url}`);
    next();
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle GET requests
app.get('/', (req, res) => {
    console.log('Serving index.html');
    res.sendFile(path.join(__dirname, 'src/pages/index.html'));
});

app.get('/getTasks', (req, res) => {
    console.log('Sending tasks:', tasks);
    res.json(tasks);
});

// Handle POST requests
app.post('/addTask', (req, res) => {
    const data = req.body;
    console.log('Received task data for addition:', data);
    
    const currentDate = new Date();
    switch (data.priority) {
        case 'high':
            currentDate.setDate(currentDate.getDate() + 1);
            break;
        case 'medium':
            currentDate.setDate(currentDate.getDate() + 3);
            break;
        case 'low':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
    }
    data.dueDate = currentDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD
    tasks.push(data);
    console.log('Task added. Current tasks:', tasks);
    res.json({ success: true });
});

app.post('/deleteTask', (req, res) => {
    const data = req.body;
    console.log('Received task data for deletion:', data);
    
    const taskIndex = tasks.findIndex(t => t.task === data.task && t.dueDate === data.dueDate);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        console.log('Task deleted. Current tasks:', tasks);
        res.json({ success: true });
    } else {
        console.log('Task not found for deletion.');
        res.status(404).send('Task not found.');
    }
});

// Handle 404 for unrecognized endpoints
app.use((req, res) => {
    console.log('404 Error: Endpoint not recognized:', req.url);
    res.status(404).send('404 Error: File Not Found');
});

app.listen(process.env.PORT || port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
