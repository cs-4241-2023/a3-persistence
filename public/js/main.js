const login = async function(event) {
    event.preventDefault()
    const form = document.getElementById("loginForm");
    const user = form.elements[0].value;
    const pass = form.elements[1].value;
    let json = { username: user, password: pass };
    const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    });
    if (response.status == 200) {
        window.location = 'app.html'
    } else {

        let container = document.getElementById("loginForm");
        let loginWarn = document.createElement("span");
        loginWarn.innerHTML = ` <div class="alert alert-secondary alert-dismissible w-50 fade show in" role="alert" id="loginWarn" style="margin: 20px auto">
            Username or password was incorrect!
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
        </div>`;
        document.body.insertBefore(loginWarn, container);
    }

}
const logout = async function(event) {
    event.preventDefault()
    const response = await fetch('/logout', {
        method: 'POST',
    });
    if (response.status == 200) {
        window.location = '/'
    }
}

const submit = async function(event) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()
    const colorName = document.querySelector('#name');
    const color1 = document.querySelector('#primary_color');
    const color2 = document.querySelector("#secondary_color");
    const color3 = document.querySelector("#teritary_color");
    const color4 = document.querySelector("#accent_1");
    const color5 = document.querySelector("#accent_2");
    if (colorName.value === "") {
        let container = document.getElementById("formContainer");
        let nameWarn = document.createElement("span");
        nameWarn.innerHTML = ` <div class="alert alert-warning alert-dismissible w-50 fade show in" role="alert" id="paletteWarn" style="margin: 20px auto">
        <strong>Warning!</strong> Palette must have a name!
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
    </div>`;
        document.body.insertBefore(nameWarn, container);
        return;
    }
    let json = { name: colorName.value, primary_color: color1.value, secondary_color: color2.value, teritary_color: color3.value, accent_1: color4.value, accent_2: color5.value };
    const response = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    });
    if (!response.ok) {
        let container = document.getElementById("formContainer");
        let dbError = document.createElement("span");
        dbError.innerHTML = ` <div class="alert alert-danger alert-dismissible w-50 fade show in" role="alert" id="paletteWarn" style="margin: 20px auto">
        <strong>Error!</strong> Something went wrong!
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
         </div>`;
        document.body.insertBefore(dbError, container);

        throw new Error("Database error");
    }
    const table = await fetch('/docs', { method: 'GET' });
    const data = await table.json();
    getData(data);
    document.getElementById("colorForm").reset();
}

const update = async function(event) {
    id = event.srcElement.id;
    event.preventDefault();
    const form = document.getElementById("form_" + id);
    console.log(form.elements[0]);
    const colorName = form.elements[0];
    const color1 = form.elements[1];
    const color2 = form.elements[2];
    const color3 = form.elements[3];
    const color4 = form.elements[4];
    const color5 = form.elements[5];
    let json = { _id: id, name: colorName.value, primary_color: color1.value, secondary_color: color2.value, teritary_color: color3.value, accent_1: color4.value, accent_2: color5.value };
    const response = await fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    });
    const table = await fetch('/docs', { method: 'GET' });
    const data = await table.json();
    getData(data);
    document.getElementById("colorForm").reset();

}

function getData(data) {
    const table = document.createElement("table");
    data.forEach(item => {
        const tr = table.insertRow();

        // delete button
        const deleteButton = tr.insertCell();
        deleteButton.appendChild(makeDeleteButton(item));

        // edit button
        const editButton = tr.insertCell();
        editButton.appendChild(makeEditButton(item));

        const td = tr.insertCell();
        td.appendChild(document.createTextNode(item["name"]));

        const color1 = tr.insertCell();
        pc = item["primary_color"];
        color1.appendChild(document.createTextNode(pc))
        color1.style.backgroundColor = pc;
        if (checkBrightness(pc)) {
            color1.style.color = "black";
        } else {
            color1.style.color = "white";
        }

        const color2 = tr.insertCell();
        pc = item["secondary_color"];
        color2.appendChild(document.createTextNode(pc))
        color2.style.backgroundColor = pc;
        if (checkBrightness(pc)) {
            color2.style.color = "black";
        } else {
            color2.style.color = "white";
        }
        const color3 = tr.insertCell();
        pc = item["teritary_color"];
        color3.appendChild(document.createTextNode(pc))
        color3.style.backgroundColor = pc;
        if (checkBrightness(pc)) {
            color3.style.color = "black";
        } else {
            color3.style.color = "white";
        }
        const color4 = tr.insertCell();
        pc = item["accent_1"];
        color4.appendChild(document.createTextNode(pc))
        color4.style.backgroundColor = pc;
        if (checkBrightness(pc)) {
            color4.style.color = "black";
        } else {
            color4.style.color = "white";
        }
        const color5 = tr.insertCell();
        pc = item["accent_2"];
        color5.appendChild(document.createTextNode(pc))
        color5.style.backgroundColor = pc;
        if (checkBrightness(pc)) {
            color5.style.color = "black";
        } else {
            color5.style.color = "white";
        }

        const editRow = table.insertRow();
        editRow.classList.add("collapse");
        editRow.id = item["_id"];
        const editCollapse = editRow.insertCell();
        editCollapse.appendChild(makeEditRow(item));

    })
    let tableContainer = document.getElementById("displayTable");
    tableContainer.innerHTML = '';
    tableContainer.append(table);
}

function makeEditRow(item) {
    let form = document.createElement("form");
    form.classList.add("form-group", "row");
    form.id = "form_" + item["_id"];
    let editName = document.createElement("input");
    editName.setAttribute("type", "text");
    editName.setAttribute("id", "n_name");
    editName.setAttribute("value", item["name"]);
    editName.classList.add("col-4", "overflow-auto");

    let editPrimary = document.createElement("input");
    editPrimary.setAttribute("type", "color");
    editPrimary.setAttribute("id", "n_primary");
    editPrimary.setAttribute("value", item["primary_color"]);

    let editSecondary = document.createElement("input");
    editSecondary.setAttribute("type", "color");
    editSecondary.setAttribute("id", "n_secondary");
    editSecondary.setAttribute("value", item["secondary_color"]);

    let editTeritary = document.createElement("input");
    editTeritary.setAttribute("type", "color");
    editTeritary.setAttribute("id", "n_teritary");
    editTeritary.setAttribute("value", item["teritary_color"]);

    let a1 = document.createElement("input");
    a1.setAttribute("type", "color");
    a1.setAttribute("id", "n_a1");
    a1.setAttribute("value", item["accent_1"]);

    let a2 = document.createElement("input");
    a2.setAttribute("type", "color");
    a2.setAttribute("id", "n_a2");
    a2.setAttribute("value", item["accent_2"]);

    let editSubmit = document.createElement("button");
    editSubmit.classList.add("editSubmit");
    editSubmit.id = item["_id"];
    editSubmit.onclick = update;
    editSubmit.innerHTML = "edit";
    editSubmit.classList.add("btn", "btn-primary");

    form.appendChild(editName);
    form.appendChild(editPrimary);
    form.appendChild(editSecondary);
    form.appendChild(editTeritary);
    form.appendChild(a1);
    form.appendChild(a2);
    form.appendChild(editSubmit);
    return form;
}


// returns true if color is too bright for white text
function checkBrightness(color) {
    luma = getBrightness(color);
    if (luma > 140) {
        return true;
    }
    return false;
}
// checks brightnesss
function getBrightness(color) {
    var c = color.substring(1); // strip #
    var rgb = parseInt(c, 16); // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff; // extract red
    var g = (rgb >> 8) & 0xff; // extract green
    var b = (rgb >> 0) & 0xff; // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // function for luma value
    return luma;
}


function makeDeleteButton(item) {
    const button = document.createElement('button');
    button.innerHTML = `<i class="fa-solid fa-x"></i>`;
    button.classList.add("btn", "btn-outline-danger", "border-0");
    button.ariaLabel = "delete" + item["name"];
    button.onclick = () => {
        deleteItem(item["_id"])
    };
    return button;
}

function makeEditButton(item) {
    const buttonDiv = document.createElement('div');
    buttonDiv.innerHTML = `<button class="btn btn-outline-dark border-0" type="button" data-toggle="collapse" data-target="#` + item["_id"] + `" aria-expanded="false" aria-controls="collapseEdit" aria-label="edit` + item["name"] + `>
    <i class="fa-solid fa-pen-to-square"></i>
  </button>`;
    return buttonDiv;
}

async function deleteItem(id) {
    const response = await fetch(`/remove/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    refreshData();
}
async function refreshData() {
    const table = await fetch('/docs', { method: 'GET' });
    const data = await table.json();
    getData(data);
}

function loginSetup() {

    let loginButton = document.getElementById("loginButton");
    loginButton.onclick = login;
}

function appSetup() {
    refreshData();
    let submitButton = document.getElementById("submit");
    submitButton.onclick = submit;
    let logoutButton = document.getElementById("logout");
    logoutButton.onclick = logout;
}