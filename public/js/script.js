// FRONT-END (CLIENT) JAVASCRIPT HERE
const submit = async function( event) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()


    const form = document.querySelector('form')

    let task=form["Task"].value;
    let deadline=new Date(form["Deadline"].value).toLocaleDateString("en-US");
    let creationDate=new Date(form["CreationDate"].value).toLocaleDateString("en-US");

    let taskValid=task!=="" && task!==undefined;
    let dateValid=creationDate.value !== "";
    let deadlineValid=deadline.value !== "";

    if(!taskValid){
        alert("Task is invalid");
    }
    if(!dateValid){
        alert("Date is invalid");
    }
    if(!deadlineValid){
        alert("Deadline is invalid");
    }

    if(taskValid && dateValid && deadlineValid){
        let json = { task, creationDate, deadline};
        let body = JSON.stringify( json );
        console.log(body);
        const response = await fetch( '/json', {
            method:'POST',
            url:'/addtask',
            body
        })
        const data = await response.json();
        LoadFromServer(data);
        ClearForm();
    }
}

function JudgePriority(deadline){
    let today=new Date();
    let dateDiff=DateDifference(today,new Date(deadline));
    let priority="High Priority"
    if(dateDiff>2){
        priority="Low Priority";
    }else if(dateDiff>1){
        priority="Medium Priority";
    }else if(isNaN(dateDiff)){
        priority="NaN";
    }
    return priority;
}

function DateDifference(day1,day2){
    let date1=Date.UTC(day1.getFullYear(), day1.getMonth(), day1.getDate());
    let date2= Date.UTC(day2.getFullYear(), day2.getMonth(), day2.getDate());

    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
}

function CreateFirstRow(){
    let row=document.createElement("tr");
    row.append(CreateHeaderCell("Task"));
    row.append(CreateHeaderCell("Creation Date"));
    row.append(CreateHeaderCell("Deadline"));
    row.append(CreateHeaderCell("Priority"));
    return row;
}

function CreateHeaderCell(cellInfo){
    const cell = document.createElement('th');
    cell.innerHTML = `<p>${cellInfo}</p>`;
    return cell;
}

function CreateRow(task,creationDate,deadline,priority,jsonString){
    let row=document.createElement("tr");
    row.append(CreateCell(task));
    row.append(CreateCell(creationDate));
    row.append(CreateCell(deadline));
    row.append(CreateCell(priority));
    return row;
}

function ClearForm(){
    const form = document.querySelector( '#addItemContainer' );
    form.Task.value="";
    form.Deadline.value="";
    form.CreationDate.value="";
}


function CreateCell(cellInfo){
    const cell = document.createElement('td');
    cell.innerHTML = `<p>${cellInfo}</p>`;
    return cell;
}

function LoadFromServer(data){
    const table=document.createElement("table");
    let firstRow=CreateFirstRow();

    table.append(firstRow);
    data.forEach(item => {
        console.log(item);
        let row=CreateRow(item["task"],
            item["creationDate"],
            item["deadline"],
            JudgePriority(item["deadline"]),
            item.toString());
        table.append(row);
    });

    let htmlTable=document.getElementById("task-table");
    htmlTable.replaceChildren();
    htmlTable.append(table);
}

window.onload = async function() {
    const addButton = document.querySelector(".add-button");
    addButton.onclick = submit;

    const response = await fetch( '/json', {
        method:'GET'
    })
    const data = await response.json();
    LoadFromServer(data);
}