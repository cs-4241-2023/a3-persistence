// FRONT-END (CLIENT) JAVASCRIPT
const submit = async function( event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault()
    
    const form = document.querySelector('form')
    let task = form["taskname"].value;
    let dueDate = new Date(form["duedate"].value);
  
    let taskValid=task!=="" && task!==undefined;
    let dueDateValid=dueDate.value !== "";
  
    if(!taskValid){
      alert("Task is invalid");
    }
    if(!dueDateValid){
      alert("Due Date is invalid");
    }
  
  
    if(taskValid && dueDateValid)
    {
      dueDate.setDate(dueDate.getDate()+1);
      let due=dueDate.toLocaleDateString();
  
      let json = {task, due};
      let body = JSON.stringify( json );
      
  
      const response1 = await fetch( '/submit', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body
      })

      await response1;
        const response2 = await fetch( '/loadTasks', {
            method:'GET'
        })

      const data = await response2.json();
      LoadFromServer(data);
      ClearForm();
    }
  }
  
  function ClearForm(){
    const form = document.querySelector( '#addItemContainer' );
    form.taskname.value="";
    form.duedate.value="";
  }
  
  function CreateDeleteButton(index){
    let json = {index};
    let dataIndex = JSON.stringify( json );
    const cell = document.createElement('td');
    cell.className="delete";
  
    const button=document.createElement('button');
    button.className="delete-button";
    button.innerHTML = `\u00D7`;
    button.onclick= (e) => {
      deleteData(dataIndex);
    }
    cell.append(button);
    return cell;
  }
  
  function CreateCell(cellInfo){
    const cell = document.createElement('td');
    cell.innerHTML = `<p>${cellInfo}</p>`;
    return cell;
  }
  
  
  function CreateFirstRow(){
    let row=document.createElement("tr");
    row.append(CreateHeaderCell("Edit"));
    row.append(CreateHeaderCell("Delete"));
    row.append(CreateHeaderCell("Task"));
    row.append(CreateHeaderCell("Due Date"));
    return row;
  }
  
  function CreateHeaderCell(cellInfo){
    const cell = document.createElement('th');
    cell.innerHTML = `<p>${cellInfo}</p>`;
    return cell;
  }
  
  function CreateRow(task,due,index){
    let row=document.createElement("tr");
    row.append(CreateEditButton(index));
    row.append(CreateDeleteButton(index));
    row.append(CreateCell(task));
    row.append(CreateCell(due));
    return row;
  }
  
  const deleteData = (dataIndex) => {
    const body = dataIndex;
    fetch( "/json", {
      method:"DELETE",
      body
    }).then(() =>{
      window.location.reload();
    })
  }
  
  function CreateEditButton(dataIndex){
    let id = JSON.stringify( dataIndex );
    const cell = document.createElement('td');
    cell.className="edit";
    const button=document.createElement('button');
    button.className="edit-button";
    button.ariaLabel="Edit Task Button";
    button.innerHTML = "Edit";
    button.onclick= (e) => {
      OpenEditForm(id);
  }
  cell.append(button);
    return cell;
  }
  let editableTaskID="";

  function OpenEditForm(dataIndex) {
    const editForm=document.querySelector(".Edit-Task");
    editForm.style.display = "block";
    editableTaskID=dataIndex;
}
const editData = (event) => {
  event.preventDefault()
  const form = document.forms[1];
  console.log(form === null || form === undefined)

  let taskname=form["taskname"].value;
  let dueDate=new Date(form["duedate"].value);
  dueDate.setDate(dueDate.getDate()+1);
  let due=dueDate.toLocaleDateString();
  let taskObject = { _id:editableTaskID,task: taskname, duedate:due};
  let body=JSON.stringify(taskObject);

  fetch("/update", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body
  }).then(r =>{
      console.log("Updated")
      window.location.reload();
  })
}

function closeEditForm(){
  const editForm=document.querySelector(".Edit-Task");
  editForm.style.display = "none";
}
  
  function LoadFromServer(data){
    const table=document.createElement("table");
    let firstRow=CreateFirstRow();
  
    table.append(firstRow);
    data.forEach((item,index) => {
      console.log(index);
      let row=CreateRow(item["task"], item["due"],index);
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