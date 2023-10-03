// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function (event, newInput) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault();
  
    let distCell = document.getElementById("distInput").value;
    let timeCell = document.getElementById("timeInput").value;
    let descCell = document.getElementById("descInput").value;
  
    let invalidFlag = false;
  
    if (distCell == "" || distCell < 0) {
      alert("Invalid Distance.");
      invalidFlag = true;
    }
    if (timeCell == "" || timeCell < 0) {
      alert("Invalid Time.");
      invalidFlag = true;
    }
  
    if (!invalidFlag) {
      const editInput = {
        distance: distCell,
        time: timeCell,
        description: descCell,
      };
      const body = JSON.stringify(editInput);
      console.log(body);
      const response = await fetch(`/newInput`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await response.json();
      console.log(data);
      parseReturnData(data);
    }
  };
  
  function parseReturnData(dataIn) {
    let newTable = document.createElement("table");
    let headerRow = CreateHeaderRow();
    newTable.append(headerRow);
    dataIn.forEach((set) => {
      console.log(set);
      let newRow = createRow(
        set["distance"],
        set["time"],
        Math.round(100 * (set["time"] / set["distance"])) / 100,
        set["description"]
      );
      newTable.append(newRow);
    });
    let indexTable = document.getElementById("outputTable");
    indexTable.replaceChildren();
    indexTable.append(newTable);
  }
  
  function CreateHeaderRow() {
    let row = document.createElement("tr");
    row.append(CreateHeader("Distance"));
    row.append(CreateHeader("Time"));
    row.append(CreateHeader("Pace"));
    row.append(CreateHeader("Description"));
    row.append(CreateHeader("Edit/Delete"));
    return row;
  }
  
  function CreateHeader(cellText) {
    const cell = document.createElement("th");
    cell.innerHTML = `<p>${cellText}</p>`;
    return cell;
  }
  
  function createRow(distance, time, pace, description) {
    let row = document.createElement("tr");
    const distCell = document.createElement("td");
    distCell.innerHTML = `<p>${distance}</p>`;
    const timeCell = document.createElement("td");
    timeCell.innerHTML = `<p>${time}</p>`;
    const paceCell = document.createElement("td");
    paceCell.innerHTML = `<p>${pace}</p>`;
    const descCell = document.createElement("td");
    descCell.innerHTML = `<p>${description}</p>`;
    const actionCell = document.createElement("td");
    actionCell.innerHTML = `<button class="edit-button" onclick="updateRow(this.parentNode.parentNode)">Edit</button><button class="delete-button" onclick="deleteRow(this.parentNode.parentNode)">Delete</button>`;
    row.append(distCell, timeCell, paceCell, descCell, actionCell);
    return row;
  }
  
  const deleteRow = async function (obj) {
    let distCell = obj.cells[0].innerText;
    let timeCell = obj.cells[1].innerText;
    let paceCell = obj.cells[2].innerText;
    let descCell = obj.cells[3].innerText;
  
    const oldInfo = {
      distance: distCell,
      time: timeCell,
      description: descCell,
    };
  
    const response = await fetch(`/getRun`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(oldInfo),
    });
  
    const oldRun = await response.json();
  
    console.log(oldRun);
    console.log(oldRun._id);
  
    const id = oldRun._id;
  
    const delresponse = await fetch(`/deleteRun`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await delresponse.json();
  
    parseReturnData(data);
  };
  
  const updateRow = async function (obj) {
    let distCell = obj.cells[0].innerText;
    let timeCell = obj.cells[1].innerText;
    let paceCell = obj.cells[2].innerText;
    let descCell = obj.cells[3].innerText;
  
    const oldInfo = {
      distance: distCell,
      time: timeCell,
      description: descCell,
    };
  
    console.log(oldInfo);
  
    const response = await fetch(`/getRun`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(oldInfo),
    });
  
    const oldRun = await response.json();
  
    console.log(oldRun);
  
    let distInput = prompt("New Distance:", distCell);
    let timeInput = prompt("New Time:", timeCell);
    let descInput = prompt("New Description:", descCell);
  
    const updateInfo = {
      oldId: oldRun._id,
      distance: distInput,
      time: timeInput,
      description: descInput,
    };
  
    console.log(updateInfo);
  
    const putResponse = await fetch(`/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateInfo),
    });
  
    const data = await putResponse.json();
  
    parseReturnData(data);
  };
  
  function registerCall() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    register(username, password);
  }
  
  const register = async function (username, password) {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });
    const data = await response.json();
    if (data) {
      alert("Registration successful!");
    } else {
      alert("Registration failed. This username is already in use.");
    }
  };
  
  function loginCall() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    login(username, password);
  }
  
  const login = async function (username, password) {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });
    const data = await response.json();
    console.log(data);
    if (data) {
      alert("Login successful!");
      window.location.href = "/index.html";
      const getResponse = await fetch(`/fetch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await getResponse.json();
      parseReturnData(data);
    } else {
      alert("Login failed. Please check your credentials.");
    }
  };
  
  window.onload = async function () {
    const getResponse = await fetch("/fetch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const data = await getResponse.json();
    console.log(data);
    if (data !== false) {
      parseReturnData(data);
    }
    const button = document.querySelector(".add-index");
    button.onclick = submit;
  };
  