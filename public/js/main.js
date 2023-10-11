// FRONT-END (CLIENT) JAVASCRIPT HERE
let modifyData = false
let modId = null
const list = document.createElement("ul");
const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const input = document.querySelectorAll('#name, #asnmt, #date, #msg'),
    json = {
      name: input[0].value,
      asnmt: input[1].value,
      date: input[2].value,
      msg: input[3].value,
      pwd:'',
    },
        
    body = JSON.stringify(json);
  
  if (modifyData === true) { 
      json._id = modId
    }

  
  fetch((modifyData === false) ? "/submit" : "/modify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  })
  .then(async function (response) {
    let data = await response.json();
    render(data);
    console.log(data);
  });
};

//render the priority field
async function render(response) {
  list.innerHTML = "";
  console.log(response)
  const item1 = document.createElement("p");
  const button_sort = document.createElement("button");
  button_sort.innerText = "Sort By Priority";
  button_sort.onclick = function () {
    prioritysort(response);
  };
  
  item1.appendChild(button_sort);
  list.appendChild(item1);
  
  for (let i = 0; i < response.length; i++) {
    const d = response[i];
    
    const item = document.createElement("li");
    item.innerHTML = `<b>Priority</b> : ${d.priority}  <b>Name</b> : ${d.name}  <b>Assignment</b> : ${d.asnmt} <b>Reason</b> : ${d.msg}`;
    const button = document.createElement("button");
    button.innerText = "Delete";
    button.onclick = function () {
      del(d, d.id);
    };
    const buttonmod = document.createElement("button");
    buttonmod.innerText = "Modify";
    buttonmod.id = 'btn' + d.id
    buttonmod.onclick = function () {
      mod(d);
    };
    
    item.appendChild(button);
    item.appendChild(buttonmod);
    list.appendChild(item);
    
  }
}

async function del(d, id) {
  fetch("/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(d)
  })
    .then(async function (response) {
    let data = await response.json();
    render(data);
    console.log(data);
  });
}

async function mod(data) {
  modifyData = true
  modId = data._id
  document.getElementById('name').value = data.name;
  document.getElementById('asnmt').value = data.asnmt;
  document.getElementById('date').value = data.date;
  document.getElementById('msg').value = data.msg;
}

async function prioritysort(data) {
  const sortedArray = [];
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    if (d.priority == "High") {
      sortedArray.push(data[i]);
    }
  }
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    if (d.priority == "Medium") {
      sortedArray.push(data[i]);
    }
  }
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    if (d.priority == "Low") {
      sortedArray.push(data[i]);
    }
  }
  data = sortedArray;
  render(data);
}

window.addEventListener('load', function() {
  const button = document.getElementById("sub-button");
  button.onclick = submit;
  document.body.appendChild(list);
})

window.onload = function () {
  const button = document.getElementById("sub-button");
  button.onclick = submit;
  document.body.appendChild(list);
};

let goto = (file, line) => {
  window.parent.postMessage(
    { type: "glitch/go-to-line", payload: { filePath: file, line: line } }, "*"
  );
};
// Get the file opening button from its class name
const filer = document.querySelectorAll(".fileopener");
filer.forEach((f) => {
  f.onclick = () => { goto(f.dataset.file, f.dataset.line); };
});
