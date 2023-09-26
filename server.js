const express = require("express");
const path = require("path");
const alert = require("alert");
const bcrypt = require("bcrypt");

const users = require("./schema/users");

const app = express();

let username = "filler";

// Convert data to json
app.use(express.json());
app.use(express.urlencoded( {extended: false} ));

app.set("view engine", "ejs");

app.get("/", (request, response) => {
    response.render("login");
})

app.get("/login", (request, response) => {
    response.render("login");
})

// Handle log in events
app.post("/main", async (request, response) => {
    // Grab log in information
    const info = {
        username: request.body.username,
        password: request.body.password
    }
    setSessionUsername(info.username);
    // Ensure fields nonempty
    if (info.username == "" || info.password == "") { 
        alert("Please fill in both fields");
        response.render("login");
    }
    else {
        try {
            const exist = await users.findOne( {username: info.username });
            // Sign user up
            if (!exist) { 
                // Add salt -> unique random string, makes hash unpredictable
                const saltRounds = 10; 
                const hashPassword = await bcrypt.hash(info.password, saltRounds);
                info.password = hashPassword;
    
                // Add new user to database
                const userInfo = await users.insertMany(info);
                alert("New user created.");
                response.render("main");
            // Attempt to log user in
            } else {
                const correctPassword = await bcrypt.compare(info.password, exist.password);
                // Successful login
                if (correctPassword) {
                    response.render("main");
                }
                else { // Wrong password
                    alert("Incorrect password, please try again.")
                }
            }
        } catch (e) {
            console.log(e);
        }
    }
})

// Add tasks to database
app.post("/maintask", async (request, response) => {
    const userN = getSessionUsername();
    const info = {
        task: request.body.task,
        date: request.body.date,
        time: request.body.time
    }
    // Make sure tasks are not empty
    if (info.task == "" || info.date == "" || info.time == "") {
        alert("Please fill in all required fields");
        response.render("main");
    }
    else {
        try {
            const rightName = { username: userN };
            const update = { 
                task: info.task,
                date: info.date,
                time: info.time
            }
            // Push new tasks to array
            await users.findOneAndUpdate(rightName, {"$push": update });
    
            response.render("main");
        } catch (e) {
            console.log(e);
        }
    }
})

// Helper functions

function setSessionUsername(name) {
    username = name;
}

function getSessionUsername() {
    return username;
}

app.listen(5000, () => {
    console.log("Running on port 5000");
});
