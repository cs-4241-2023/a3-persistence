
// IMPORTANT: you must run `npm install` in the directory for this assignment
// to install the mime library if you're testing this on your local machine.
// However, Glitch will install it automatically by looking in your package.json
// file.

const express = require("express");
const mongoose = require("mongoose");
var userid = 0;


const server = express();

server.use(express.static('public'));

server.use(express.json());

server.listen(3000, () => {
  console.log("Server successfully started at http://localhost:3000");
})


class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
      .connect(`mongodb+srv://user1:1@todo-list.sgjif6n.mongodb.net/?retryWrites=true&w=majority`)
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection failed');
      });
  }
}

module.exports = new Database();

// # define the schema database of mongoose
const todo_list = new mongoose.Schema({
  todo_item: String,
  date_added: String,
  priority: Number,
  due_by: String,
  user_id: Number,
});
const user_list = new mongoose.Schema({
  user: String,
  pass: String,
  user_id: Number,
});

const item = mongoose.model('item', todo_list);
const user = mongoose.model('user', user_list)

server.post("/submit", async (request, response) => {
  console.log(userid);

  let data_string = request.body;

  let todo_entry = data_string;

  let date = new Date(todo_entry["datetime"]);
  let due_date = new Date(
    date.setDate(date.getDate() + todo_entry["priority"] * 7)
  );

  todo_entry["due_date"] = due_date;
  let new_todo_entry = new item({
    todo_item: todo_entry["todo_list_item"],
    date_added: todo_entry["datetime"],
    priority: todo_entry["priority"],
    due_by: todo_entry["due_date"],
    user_id: userid,
  })

  try {
    //     response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    //     response.end(JSON.stringify(appdata));
    await new_todo_entry.save();
    let find_query = await item.find({ user_id: userid });
    response.send(find_query);
  } catch (error) {
    response.status(500).send(error);
  }
});

server.post("/delete", async (request, response) => {
  console.log(userid);

  let data_string = request.body;
  try {

    await item.findOneAndDelete({ user_id: userid, todo_item: data_string["item_to_delete"] });

    let find_query = await item.find({ user_id: userid });

    response.send(find_query);

  } catch (error) {
    console.log("This is in the error for delete")
    response.status(500).send(error);
  }
});

server.post("/login", async (request, response) => {
  console.log(userid);

  let data_string = request.body;
  let login = data_string;

  let index = await user.find({ user: login["user"] });

  try {
    if (login["user"] === index[0]["user"] && login["pass"] === index[0]["pass"]) {
      userid = index[0]["user_id"];
      console.log(index)
      console.log(index[0]["user_id"])
      response.send(true);
    }
    else {
      response.send(false)
    }
  } catch (error) {
    response.status(500).send(error);
  }

})

server.post("/register", async (request, response) => {
  console.log(userid);

  let data_string = request.body;
  console.log("This is the log in")
  console.log(data_string);

  let index = await user.find({ user: data_string["user"] });

  let new_user = new user({
    user: data_string["user"],
    pass: data_string["pass"],
    user_id: new Date().valueOf(),
  })
  console.log("This is the new user")
  console.log(new_user)
  console.log("This is the index")
  console.log(index)

  try {
    if (index.length === 0) {
      console.log("Testing Crash Part 1")
      await new_user.save();
      console.log("Testing Crash Part 2")

      response.send(true);
    }
    else {
      console.log("Testing Crash Part 3")
      response.send(false);
    }
  } catch (error) {
    console.log("Testing Crash Part 4")
    response.status(500).send(error);
  }

})

server.post("/modify", async (request, response) => {
  console.log(userid);

  let data_string = request.body;
  let find_item = await item.find({ user_id: userid, todo_item: data_string["item_to_modify"] });


  let date = new Date(find_item[0]["due_by"]);
  console.log("This is date: ", date);
  let due_date = new Date(date.setDate(date.getDate() + 7));
  console.log("This is due_date: ", due_date);

  try {
    await item.updateMany({ user_id: userid, todo_item: data_string["item_to_modify"] }, { $set: { due_by: due_date } }, { "multi": true });

    let find_query = await item.find({ user_id: userid },);
    response.send(find_query);

  } catch (error) {
    console.log("This is in the error for delete")
    response.status(500).send(error);
  }
});

server.get("/get", async (request, response) => {
  const users = await item.find({});
  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});