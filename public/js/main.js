// FRONT-END (CLIENT) JAVASCRIPT HERE
let usn = "";
document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("login_btn");
  const submitButton = document.getElementById("submit_btn");
  const logoutButton = document.getElementById("logout_btn");

  loginButton.addEventListener("click", function (event) {
    event.preventDefault();
    login();
  });

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    submit();
  });

  logoutButton.addEventListener("click", function (event) {
    event.preventDefault();
    const name = document.getElementById("name");
    name.innerHTML = "";
    renderList();
  });

  const submit = async function (event) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    //event.preventDefault();

    const input = document.querySelector("#action"),
      json = { action: input.value },
      body = JSON.stringify(json);

    const response = await fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const error = await response.json();
    if (error.message === "Please Login") {
      window.alert("Please Login");
      console.log(error.username);
    } else {
      const response2 = await fetch("/list", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response2.json();
      console.log(data);
      updateList(data);
    }
  };

  const login = async function (event) {
    //event.preventDefault();

    const username = document.querySelector("#username"),
      password = document.querySelector("#password"),
      json = { username: username.value, password: password.value },
      body = JSON.stringify(json);

    //console.log(json.username);
    if (json.username === "" || json.password === "") {
      window.alert("Please enter a username and password");
    } else {
      usn = username;

      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      const succ = await response.json();
      if (succ.message === "Succesfully Logged in") {
        const response2 = await fetch("/list", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response2.json();
        //console.log("login data: " + data)
        updateList(data);
      }
    }
  };

  //Update list
  function updateList(data) {
    const list = document.getElementById("list");
    const name = document.getElementById("name");
    if (usn !== "") {
      name.innerHTML = usn.value + "'s Bucket List";
    }

    list.innerHTML = "";

    const rowHead = document.createElement("tr");
    const actionHead = document.createElement("th");
    actionHead.innerText = "Action";
    const dateHead = document.createElement("th");
    dateHead.innerText = "Date Created";
    const deleteHead = document.createElement("th");
    deleteHead.innerText = "Remove";
    const completeHead = document.createElement("th");
    completeHead.innerText = "Completed";
    const dateCompletedHead = document.createElement("th");
    dateCompletedHead.innerText = "Date Completed";
    rowHead.appendChild(actionHead);
    rowHead.appendChild(dateHead);
    rowHead.appendChild(completeHead);
    rowHead.appendChild(dateCompletedHead);
    rowHead.appendChild(deleteHead);
    list.appendChild(rowHead);

    data.forEach((action) => {
      const row = document.createElement("tr");

      const actionCell = document.createElement("td");
      actionCell.innerText = action.action;
      actionCell.classList.add("align-middle");

      const dateCell = document.createElement("td");
      dateCell.innerText = new Date(action.date).toLocaleString();
      dateCell.classList.add("align-middle");

      const completeButton = document.createElement("button");
      completeButton.innerText = action.complete;
      completeButton.classList.add("btn", "btn-primary", "btn-sm");
      completeButton.onclick = function () {
        const index = data.indexOf(action);
        if (index !== -1) {
          fetch("/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data[index]),
          });

          fetch("/list", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
            .then((response) => response.json())
            .then((data) => {
              updateList(data);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      };

      const dateCompletedCell = document.createElement("td");
      dateCompletedCell.innerText = action.dateCompleted;

      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete";
      deleteButton.classList.add("btn", "btn-danger", "btn-sm");
      deleteButton.onclick = function () {
        const index = data.indexOf(action);
        console.log(index);
        if (index !== -1) {
          fetch("/remove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data[index]),
          });

          fetch("/list", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          })
            .then((response) => response.json())
            .then((data) => {
              updateList(data);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      };
      row.appendChild(actionCell);
      row.appendChild(dateCell);
      row.appendChild(completeButton);
      row.appendChild(dateCompletedCell);
      row.appendChild(deleteButton);
      list.appendChild(row);
    });

    document.body.appendChild(list);
  }

  //render list when window is opened
  const renderList = async function () {
    const reset = await fetch("/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const logout = await reset.json();
    usn = "";

    const response = await fetch("/list", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    //console.log(data);
    updateList(data);
  };

  window.onload = function () {
    renderList();
    // const button = document.querySelector("button");
    // button.onclick = submit;
  };
});
