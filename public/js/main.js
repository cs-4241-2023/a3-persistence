// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const input = document.querySelectorAll(".todo_add");
  const json = {
    todo_list_item: input[0].value,
    datetime: input[1].value,
    priority: input[2].value,
  };
  const body = JSON.stringify(json);

  console.log("This is the body in submit ");
  console.log(json);
  console.log(body);

  const response = await fetch("/submit", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  const text = await response.text();

  console.log("text:", text);

  // create table rows
  const table = JSON.parse(text)
    .map((entry) => {
      return `<tr>
        <td>${entry.todo_item}</td>
        <td>${entry.date_added}</td>
        <td>${entry.priority}</td>
        <td>${entry.due_by}</td>
     </tr>`;
    })
    .join("");

  document.querySelector("#todo_table").innerHTML = table;

  console.log("text:", text);
  console.log("(Body) Request Resulted in: ", body);
};

const delete_todo = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const input = document.querySelector("#delete_item"),
    json = {
      item_to_delete: input.value,
    },
    body = JSON.stringify(json);

  const response = await fetch("/delete", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  const text = await response.text();
  console.log("This is the text in the delete");
  console.log(text);

  // create table rows
  const table = JSON.parse(text)
    .map((entry) => {
      return `<tr>
        <td>${entry.todo_item}</td>
        <td>${entry.date_added}</td>
        <td>${entry.priority}</td>
        <td>${entry.due_by}</td>
     </tr>`;
    })
    .join("");

  document.querySelector("#todo_table").innerHTML = table;

  console.log("text:", text);
  console.log("(Body) Request Resulted in: ", body);

  console.log("[Deletion] text:", text);
  console.log("[Deletion] (Body) Request Resulted in: ", body);
};

const modify_todo = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const input = document.querySelector("#modify_item"),
    json = {
      item_to_modify: input.value,
    },
    body = JSON.stringify(json);

  const response = await fetch("/modify", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  const text = await response.text();

  // create table rows
  const table = JSON.parse(text)
    .map((entry) => {
      return `<tr>
        <td>${entry.todo_item}</td>
        <td>${entry.date_added}</td>
        <td>${entry.priority}</td>
        <td>${entry.due_by}</td>
     </tr>`;
    })
    .join("");

  document.querySelector("#todo_table").innerHTML = table;

  console.log("text:", text);
  console.log("(Body) Request Resulted in: ", body);

  console.log("[Deletion] text:", text);
  console.log("[Deletion] (Body) Request Resulted in: ", body);
};

const login = async function (event) {
  event.preventDefault();

  const input = document.querySelectorAll(".login");
  const json = {
    user: input[0].value,
    pass: input[1].value,
  };
  const body = JSON.stringify(json);

  console.log("This is the body in login ");
  console.log(body);

  const response = await fetch("/login", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  const text = await response.text();

  console.log(text)
  if (text === "true") {
    alert("Successfully Logged In!")
    document.getElementById("login").style.display = "none";
    document.getElementById("lower").style.display = "none";
  }
  else {
    alert("Failed to Log In!")
  }

  console.log("text:", text);
}

const register = async function (event) {
  event.preventDefault();

  const input = document.querySelectorAll(".register");
  const json = {
    user: input[0].value,
    pass: input[1].value,
  };
  const body = JSON.stringify(json);

  console.log("This is the body in register ");
  console.log(body);

  const response = await fetch("/register", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  const text = await response.text();
  if (text === "true") {
    alert("Successfully Registered!")
  }
  else {
        alert("Failed to Register!")
  }


  console.log("text:", text);
  // location.reload()
}

window.onload = function () {
  const submit_button = document.getElementById("submit_to_todo");
  const delete_button = document.getElementById("delete_from_todo");
  const modify_button = document.getElementById("modify_todo");
  const login_button = document.getElementById("submit_login");
  const register_button = document.getElementById("submit_register");

  submit_button.onclick = submit;
  delete_button.onclick = delete_todo;
  modify_button.onclick = modify_todo;
  login_button.onclick = login;
  register_button.onclick = register;
};
