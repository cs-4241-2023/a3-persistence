const express = require("express"),
      { MongoClient, ObjectId } = require("mongodb"),
      cookie = require("cookie-session"),
      app = express(),
      ejs = require("ejs"),
      env = require("dotenv").config(),
      port = 3000;

const dbURL =
    "mongodb+srv://" +
    process.env.DB_USERNAME +
    ":" +
    process.env.DB_PASSWORD +
    "@" +
    process.env.DB_HOST;

const dbClient = new MongoClient(dbURL);
let assignmentCollection = null;
let loginCredentialCollection = null;

const initDatabase = async () => {
    await dbClient.connect();
    assignmentCollection = await dbClient.db("Database0").collection("Collection0");
    loginCredentialCollection = await dbClient.db("Database0").collection("Collection1");
}
initDatabase().then(() => {
    console.log("Connecting to database...");
    if(assignmentCollection !== null && loginCredentialCollection !== null) {
        console.log("Connected to database!");
    } else {
        console.error("Database connection not found");
    }
});

app.use(async (request, response, next) => {
    if(assignmentCollection !== null && loginCredentialCollection !== null) {
       next();
   } else {
       response.sendStatus(503);
   }
});

app.use(express.json());
app.use(express.urlencoded({ extended:true }))
app.use(cookie({
    name: "session",
    keys: ["key1", "key2"]
}));

app.engine("html", ejs.renderFile);

const initialFileServe = (request, response) => {
    if(request.session.loginStatus === true) {
        response.sendFile(__dirname + "/public/app.html");
    } else {
        response.sendFile(__dirname + "/public/index.html");
    }
}
app.get("/", (request, response) => initialFileServe(request, response));
app.get("/index.html", (request, response) => initialFileServe(request, response));

app.get("/index.html", (request, response) => {
    if(request.session.loginStatus === true) {
        response.sendFile(__dirname + "/public/app.html");
    } else {
        response.sendFile(__dirname + "/public/index.html");
    }
});

app.get("/app.html", (request, response) => {
    if(request.session.loginStatus === false || request.session.loginStatus === undefined) {
        response.sendFile(__dirname + "/public/index.html");
    } else {
        response.sendFile(__dirname + "/public/app.html");
    }
});
app.get("/auth", (request, response) => {
    response.writeHead(200, "OK", {'Content-Type': 'text/json'});
    response.end(JSON.stringify({status: request.session.loginStatus, currentUser:request.session.currentUser}));
});

app.get("/logout", (request, response) => {
    request.session.loginStatus = false;
    response.redirect("/");
});

app.use(express.static(__dirname + "/public"));

app.post("/login", async (request, response) => {

    let loginRequestJSON = {
        username: request.body.username,
        password: request.body.password
    };

    let loginResult = await loginCredentialCollection.find(loginRequestJSON).toArray();

    if (loginResult.length === 1){
        request.session.loginStatus = true;
        request.session.currentUser = request.body.username;
        response.redirect("app.html")
    } else {
        request.session.loginStatus = false;
        request.session.currentUser = "";
        response.render(__dirname + "/public/index.html", {status: "Username or Password was Incorrect"});
    }
});

app.post("/account-lookup", async (request, response) => {
    let accountsFound = await loginCredentialCollection.find(request.body).toArray();
    let resultJSON = null;

    if(request.body.username === "" || request.body.password === ""){
        resultJSON = JSON.stringify({status: "Username or Password Cannot Be Empty."})
    } else if(accountsFound.length === 0) {
        await loginCredentialCollection.insertOne(request.body);
        resultJSON = JSON.stringify({status: "Account Created. Please Log In."})
    } else if(accountsFound.length === 1) {
        resultJSON = JSON.stringify({status: "Account Already Exists!"})
    }
    response.writeHead(200,{ "Content-Type" : "application/json" });
    response.end(resultJSON);
})

app.get("/assignment-data", async (request, response) => {
    let assignmentData = await assignmentCollection.find({}).toArray(); // TODO: This should probably be looked up by account
    response.writeHead(200, "OK", {'Content-Type': 'text/json'});
    response.end(JSON.stringify(assignmentData));
});

app.post("/submit", async (request, response) => {
    let sentData = request.body;
    let result = await handleAssignmentData(sentData);
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(result);
});

app.put("/assignment-edit", async (request, response) => {
    let result = await assignmentCollection.updateOne(
        {_id: new ObjectId(request.body._id)},
        {
            $set: {
                className: request.body.className,
                assignmentName: request.body.assignmentName,
                dueDate: request.body.dueDate,
                difficulty: request.body.difficulty,
                priority: calculatePriority(request.body.dueDate, request.body.difficulty)
            }
        }
    );
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end(JSON.stringify({result: "success", message: ""}));
});

app.delete("/assignment-delete", async (request, response) => {
    await assignmentCollection.deleteOne({
        _id: new ObjectId(request.body._id)
    });
    response.writeHead(200,{ "Content-Type" : "application/json" });
    response.end(JSON.stringify({result: "success", message: ""}));
});

app.listen(process.env.PORT || port) // set up server to listen on port 3000

const handleAssignmentData = async function (sentData) {
    let id = sentData.id;
    let className = sentData.className;
    let assignmentName = sentData.assignmentName;
    let dueDate = sentData.dueDate;
    let difficulty = sentData.difficulty;
    let difficultyNum = parseInt(difficulty);

    // send failure if any of the fields are empty
    if (className === "" || assignmentName === "" || dueDate === "") {
        return JSON.stringify({result: "failure", message: "One or more fields are empty!"});
    } else if (difficulty === "" || isNaN(difficultyNum) || difficultyNum < 0 || difficultyNum > 10) {
        return JSON.stringify({result: "failure", message: "Difficulty must be an integer between 1 and 10!"});
    } else {
        let priority = calculatePriority(dueDate, difficulty); // calculate derived field

        await assignmentCollection.insertOne(
            {
                id: id,
                className: className,
                assignmentName: assignmentName,
                dueDate: dueDate,
                difficulty: difficulty,
                priority: priority
            }
        );
        return JSON.stringify({result: "success", message: ""});
    }
}

const calculatePriority = function (dueDate, difficulty) {
  let date = new Date(dueDate);

  if((difficulty > 0 && difficulty <= 3) || date.getDay() >= 14) {
      return "Low"
  } else if((difficulty > 3 && difficulty <= 6) || (date.getDay() >= 7 && date.getDay() < 14)) {
      return "Medium"
  } else {
      return "High"
  }
}