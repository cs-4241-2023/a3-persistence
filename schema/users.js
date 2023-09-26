const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://127.0.0.1/ToDoListDB", {
    useNewUrlParser: true,  
    useUnifiedTopology: true,  
});

connect.then(() => {
    console.log("Database successfully connected");
})
.catch ((e) => {
    console.log(e);
    console.log("Error connecting database.");
})

// user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require:true
    },
    password: {
        type: String,
        require: true
    },
    task: {
        type: Array
    },
    date: {
        type: Array
    },
    time: {
        type: Array,
    }
})

const users = new mongoose.model("Users", userSchema);
module.exports = users;
