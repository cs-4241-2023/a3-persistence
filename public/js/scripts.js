
let old_edit_task = null
const Todo = []
const task = document.getElementById('to_do')
const date = document.querySelector('#date')
const priority = document.querySelector('#priority')
const results = document.getElementById("results")
const add = document.querySelector('#add')
let json
let table_len

fetch("/currentdb", {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
}).then(async (response) => {
    const data = await response.json()
    data.forEach(item => {
        Todo.push(item)
            table_len = (results.rows.length) - 1
            results.insertRow(table_len + 1).innerHTML = "<tbody><tr id='row" + table_len + "'><td id='task_row" + table_len + "'>" + item.Task + "</td><td id='date_row" + table_len + "'>" + item.Date + "</td><td id='priority_row" + table_len + "'>" + item.Priority + "</td><td><input type='button' class='btn-primary' id='edit_button" + table_len + "' value='Edit' class='edit' onclick='edit_row(" + table_len + ")'> <input type='button' class='btn-primary' id='save_button" + table_len + "' value='Save' class='save' onclick='save_row(" + table_len + ")'> <input type='button' class='btn-primary' value='Delete' class='delete' onclick='delete_row(" + table_len + ")'></td></tr></tbody>"
    })
})

function isEmpty(){
    if (task.value === "" || date.value === "" || task.value === null || date.value === null || priority.value === "none" || priority.value === null){
        alert("Please fill out all fields")
        return true
    }
    return false
}

add.onclick = function (event){
    event.preventDefault()
    if (isEmpty() === false) {
        add_row()
    }
}
function add_row(){

    // table_len = (results.rows.length) - 1
    results.insertRow(table_len + 1).innerHTML= "<tbody><tr id='row"+table_len+"'><td id='task_row"+table_len+"'>"+task.value+"</td><td id='date_row"+table_len+"'>"+date.value+"</td><td id='priority_row"+table_len+"'>"+priority.value+"</td><td><input type='button' class='btn-primary' id='edit_button"+table_len+"' value='Edit' class='edit' onclick='edit_row("+table_len+")'> <input type='button' class='btn-primary' id='save_button"+table_len+"' value='Save' class='save' onclick='save_row("+table_len+")'> <input type='button' class='btn-primary' value='Delete' class='delete' onclick='delete_row("+table_len+")'></td></tr></tbody>"
    json = {
        username:'',
        password:'',
        Task: task.value,
        Date: date.value,
        Priority: priority.value,
        unmodified: ''
    }
    Todo.push(json)
    task.value = ""
    date.value = ""
    priority.value = ""

    fetch('/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(json)
    })
        .then(response => response.json())
}
function edit_row(index)
{
    document.getElementById("edit_button"+index).style.display="none";
    document.getElementById("save_button"+index).style.display="block";
    let task=document.getElementById("task_row"+index);
    let date=document.getElementById("date_row"+index);
    let priority=document.getElementById("priority_row"+index);

    let task_data=task.innerHTML;
    let date_data=date.innerHTML;
    let priority_data=priority.innerHTML;

    old_edit_task = task_data;
    task.innerHTML="<input type='text' id='task_text"+index+"' value='"+task_data+"'>";
    date.innerHTML="<input type='date' id='date_text"+index+"' value='"+date_data+"'>";
    priority.innerHTML="<select id='priority_text"+index+"''><option value='"+priority_data+"'>"+priority_data+"</option><option>High</option><option>Medium</option><option>Low</option></select>"

    fetch('/edit', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(Todo[index])
    })
        .then( response => response.json())
}

function save_row(index){
    let task_val=document.getElementById("task_text"+index).value;
    let date_val=document.getElementById("date_text"+index).value;
    let priority_val=document.getElementById("priority_text"+index).value;

    document.getElementById("task_row"+index).innerHTML=task_val;
    document.getElementById("date_row"+index).innerHTML=date_val;
    document.getElementById("priority_row"+index).innerHTML=priority_val;

    document.getElementById("edit_button"+index).style.display="block";
    document.getElementById("save_button"+index).style.display="none";

    for (let i = 0; i < Todo.length; i++) {
        if (i === index){
            Todo[i].Task = task_val
            Todo[i].Date = date_val
            Todo[i].Priority = priority_val
        }
    }
    
    Todo[index].oldtask = old_edit_task
    fetch('/save', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(Todo[index])
    })
        .then( response => response.json())


}


function delete_row(index){
    fetch('/delete', {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify( Todo[index] )
    })
        .then( response => response.json())
    for (let j = 0; j < Todo.length; j++) {
        if (index === j){
            Todo.splice(j,1)
        }
    }
    let i = event.target.parentNode
    let tr = i.parentNode
    tr.parentNode.removeChild(tr)

}


