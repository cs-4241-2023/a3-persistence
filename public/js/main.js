// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const depostInput = document.querySelector("#deposit-input"),
    startInput = document.querySelector("#start-date-input"),
    rateInput = document.querySelector("#rate-input"),
    json = {
      deposit: depostInput.value / 1,
      startDate: startInput.value,
      rate: rateInput.value / 100,
    },
    body = JSON.stringify(json);

  console.log(body);
  const response = await fetch("/submit", {
    method: "POST",
    body,
  });

  const data = await response.json();

  console.log("text:", data);
  update(data);
  hideDeleteButtons();
};

const firstLoad = async function () {
  const response = await fetch("/getData");
  
  console.log("first load");

  const data = await response.json();

  update(data);
  hideDeleteButtons();
};

const hideModifyView = () => {
  document.getElementById("modifyView").hidden = true;
  document.getElementById("dataView").hidden = false;

  document.getElementById("finishModifyButton").hidden = true;
  document.getElementById("modifyButton").hidden = false;
  document.getElementById("deleteButton").hidden = false;
};

const showModifyView = () => {
  document.getElementById("modifyView").hidden = false;
  document.getElementById("dataView").hidden = true;

  document.getElementById("finishModifyButton").hidden = false;
  document.getElementById("modifyButton").hidden = true;
  document.getElementById("deleteButton").hidden = true;
};

const displayModifyView = (data) => {
  document.getElementById("modifyView").innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    let tableRow = document.createElement("tr"),
      idColumn = document.createElement("td"),
      depositColumn = document.createElement("td"),
      startDateColumn = document.createElement("td"),
      rateColumn = document.createElement("td"),
      accruedColumn = document.createElement("td"),
      deleteButtonColumn = document.createElement("td");

    //input elements
    let textId = document.createElement("p"),
      inputDeposit = document.createElement("input"),
      inputStart = document.createElement("input"),
      inputRate = document.createElement("input"),
      textAccrued = document.createElement("p");

    inputDeposit.setAttribute("type", "number");
    inputDeposit.setAttribute("min", "0");
    inputDeposit.setAttribute("step", "0.01");
    inputDeposit.setAttribute("form", "modifyForm");

    inputRate.setAttribute("type", "number");
    inputRate.setAttribute("min", "0");
    inputRate.setAttribute("max", "100");
    inputRate.setAttribute("step", "0.01");
    inputRate.setAttribute("form", "modifyForm");

    inputStart.setAttribute("type", "date");
    inputStart.setAttribute("form", "modifyForm");
    setTodayMax(inputStart);

    textId.textContent = data[i].id;
    inputDeposit.value = data[i].deposit;
    inputStart.value = data[i].startDate;
    inputRate.value = data[i].rate * 100;

    idColumn.appendChild(textId);
    idColumn.hidden = true;
    depositColumn.appendChild(inputDeposit);
    startDateColumn.appendChild(inputStart);
    rateColumn.appendChild(inputRate);
    accruedColumn.appendChild(textAccrued);
    tableRow.appendChild(idColumn);
    tableRow.appendChild(depositColumn);
    tableRow.appendChild(startDateColumn);
    tableRow.appendChild(rateColumn);
    tableRow.appendChild(accruedColumn);

    document.querySelector("#modifyView").appendChild(tableRow);
  }
};

const displayResults = (data) => {
  document.getElementById("dataView").innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    let tableRow = document.createElement("tr");
    let idColumn = document.createElement("td"),
      depositColumn = document.createElement("td"),
      startDateColumn = document.createElement("td"),
      rateColumn = document.createElement("td"),
      accruedColumn = document.createElement("td"),
      deleteButtonColumn = document.createElement("td");

    let textId = document.createElement("p"),
      textDeposit = document.createElement("p"),
      textStart = document.createElement("p"),
      textRate = document.createElement("p"),
      textAccrued = document.createElement("p"),
      deleteButton = document.createElement("button");

    textId.textContent = data[i].id;
    textDeposit.textContent = data[i].deposit.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    textStart.textContent = data[i].startDate;
    textRate.textContent = data[i].rate * 100 + "%";
    textAccrued.textContent = data[i].accrued.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    idColumn.appendChild(textId);
    idColumn.hidden = true;
    depositColumn.appendChild(textDeposit);
    startDateColumn.appendChild(textStart);
    rateColumn.appendChild(textRate);
    accruedColumn.appendChild(textAccrued);
    tableRow.appendChild(idColumn);
    tableRow.appendChild(depositColumn);
    tableRow.appendChild(startDateColumn);
    tableRow.appendChild(rateColumn);
    tableRow.appendChild(accruedColumn);

    //button stuff
    deleteButton.textContent = "Delete";
    deleteButton.onclick = async () => {
      await deleteData(i);
      //document.getElementById("dataView").deleteRow(i);
    };
    deleteButtonColumn.appendChild(deleteButton);
    deleteButtonColumn.setAttribute("class", "deleteButton");
    deleteButtonColumn.hidden = true;
    tableRow.appendChild(deleteButtonColumn);

    document.querySelector("#dataView").appendChild(tableRow);
  }
};

const showDeleteButtons = function () {
  document.getElementById("deleteColumn").hidden = false;

  let buttons = document.querySelectorAll(".deleteButton");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].hidden = false;
  }

  document.querySelector("#deleteButton").hidden = true;
  document.querySelector("#finishDeleteButton").hidden = false;

  document.getElementById("modifyButton").hidden = true;
};

const hideDeleteButtons = function () {
  document.getElementById("deleteColumn").hidden = true;
  document.querySelector("#finishDeleteButton").hidden = true;
  let buttons = document.querySelectorAll(".deleteButton");

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].hidden = true;
  }
};

const deleteData = async function (row) {
  let dataRow = document.getElementById("dataView").getElementsByTagName("tr");
  let idValue = dataRow[row].querySelector("td"),
    json = {
      id: Number(idValue.textContent),
    },
    body = JSON.stringify(json);

  const response = await fetch("/delete", {
    method: "POST",
    body,
  });

  const data = await response.json();

  console.log("delete:", data);
  update(data);
  showDeleteButtons();
};

const showController = function () {
  //show all controller buttons
  document.querySelector("#deleteButton").hidden = false;
  document.querySelector("#modifyButton").hidden = false;

  //hide all delete buttons
  hideDeleteButtons();

  //hide finish button
  document.querySelector("#finishDeleteButton").hidden = true;
  document.querySelector("#finishModifyButton").hidden = true;
};

const setTodayMax = function (element) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;
  element.setAttribute("max", today);
};

const sendModifiedReq = async (event) => {
  event.preventDefault();

  const modifiedData = [];

  let modifiedDataRow = document.getElementById("modifyView").children;
  for (let i = 0; i < modifiedDataRow.length; i++) {
    let inputs = modifiedDataRow[i].children;

    let id = inputs[0].firstElementChild,
      depositInput = inputs[1].firstElementChild,
      startInput = inputs[2].firstElementChild,
      rateInput = inputs[3].firstElementChild;

    let json = {
      deposit: depositInput.value / 1,
      startDate: startInput.value,
      rate: rateInput.value / 100,
      id: id.textContent,
    };

    modifiedData.push(json);
  }

  let body = JSON.stringify(modifiedData);

  const response = await fetch("/modify", {
    method: "POST",
    body,
  });

  const data = await response.json();

  update(data);
  hideModifyView();
};

const update = (data) => {
  displayResults(data);
  displayModifyView(data);
  hideModifyView();
};

window.onload = function () {
  document.querySelector("#taskForm").onsubmit = submit;
  document.querySelector("#deleteButton").onclick = showDeleteButtons;
  document.querySelector("#finishDeleteButton").onclick = showController;
  document.querySelector("#modifyButton").onclick = showModifyView;
  document.querySelector("#modifyForm").onsubmit = sendModifiedReq;
  console.log("loaded");
  setTodayMax(document.getElementById("start-date-input"));
  firstLoad();
};
