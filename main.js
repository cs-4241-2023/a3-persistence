function addListItem() {
    event.preventDefault();
    var itemInput = document.getElementById("addTask").value;
    var dateInput = document.getElementById("addDueDate").value;
    var timeInput = document.getElementById("addDueTime").value;
    console.log("Doc worked");
    var list = document.getElementById("list");
    var listItem = document.createElement("li");
    var buttonDiv = document.createElement("div");
    listItem.classList.add("list-group-item", "list-group-item-action");
    
    var editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("btn", "btn-secondary", "btn-small", "me-5", "mt-2", "mb-1");
    var delButton = document.createElement("button");
    
    delButton.textContent = "Delete";
    delButton.classList.add("btn", "btn-danger", "btn-small", "ms-5", "mt-2", "mb-1");
    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(delButton);
    
    var txt = document.createTextNode(itemInput + " due " + dateInput + " at " + timeInput);
    
    if (itemInput=="" | dateInput=="" | timeInput=="") {
      alert("Please fill in the required fields");
    } else {
      listItem.appendChild(txt); // add text to new li element
      listItem.appendChild(buttonDiv);
      listItem.appendChild(editButton);
      listItem.appendChild(delButton);
      //delButton.setAttribute("id", "d" + txt.value);
      listItem.setAttribute("id", txt.value);
      list.appendChild(listItem); // append list and buttons
      
      // Clear previous task info 
      document.getElementById("addTask").value = "";
      document.getElementById("addDueDate").value = "";
      document.getElementById("addDueTime").value = "";
      delButton.addEventListener("click", function() {
        delListItem(txt.value);
      });
    }
  } 
  