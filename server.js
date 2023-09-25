const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const uri = process.env.uri;
let db;

MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    db = client.db("Database1");
    console.log("Connected to MongoDB");
});

app.get('/appdata', (req, res) => {
    const currentUser = req.query.username;

    db.collection('users').findOne({ username: currentUser }, (err, user) => {
        if (err) throw err;
        
        // Check if user exists
        if (user) {
            const tasks = user.tasks.filter(task => task !== null);  // Filter out null tasks
            res.json(tasks);
        } else {
            // Return an empty array or an error if user doesn't exist
            res.json([]);
        }
    });
});


app.post('/appdata', (req, res) => {
    console.log("Received task from client:", req.body);
    const task = req.body;
    const currentUser = req.body.username;  
    delete task.username;

    db.collection('users').updateOne({ username: currentUser }, { $push: { tasks: task } }, (err, result) => {
        if (err) throw err;
        res.json(task);
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.collection('users').findOne({ username }, (err, user) => {
        if (err) throw err;
        if (!user) {
            db.collection('users').insertOne({ username, password, tasks: [] }, (err) => {
                if (err) throw err;
                res.json({ username, isAuthenticated: true });
            });
        } else {
            res.json({
                username,
                isAuthenticated: user.password === password
            });
        }
    });
});
app.put('/appdata/:taskId/completion', (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const isCompleted = req.body.completed;
    const currentUser = req.body.username;
    const updateField = `tasks.${taskId}.completed`;

    db.collection('users').updateOne({ username: currentUser }, { $set: { [updateField]: isCompleted } }, (err) => {
        if (err) throw err;
        res.json({ success: true });
    });
});



app.put('/appdata/:taskId', (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const { text, priority, creation_date } = req.body;
    const currentUser = req.body.username;

    const updates = {};
    if (text) updates[`tasks.${taskId}.text`] = text;
    if (priority) updates[`tasks.${taskId}.priority`] = priority;
    if (creation_date) updates[`tasks.${taskId}.creation_date`] = creation_date;

    db.collection('users').updateOne({ username: currentUser }, { $set: updates }, (err) => {
        if (err) throw err;
        res.json({ success: true });
    });
});


app.delete('/appdata/:taskId', (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const currentUser = req.body.username;

  
    db.collection('users').findOne({ username: currentUser }, (err, user) => {
        if (err || !user) {
            console.warn("Error finding user or user not found.");
            res.status(404).json({ success: false, message: 'User or task not found.' });
            return;
        }

        const taskToRemove = user.tasks[taskId];
        
        
        db.collection('users').updateOne(
            { username: currentUser },
            { $pull: { tasks: taskToRemove } }
        ).then(result => {
            if (result.modifiedCount === 0) {
                console.warn("No tasks were deleted.");
                res.status(404).json({ success: false, message: 'Task not found.' });
                return;
            }
            res.json({ success: true });
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
