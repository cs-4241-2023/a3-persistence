// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const input1 = document.querySelector( '#name' )
  const input2 = document.querySelector( '#age' ) 
  const input3 = document.querySelector( '#breed' )
  const input4 = document.querySelector( '#favAct' )


  json = { name: input1.value, age: input2.value, breed: input3.value, favAct: input4.value, toBeDeleted: false}
  body = JSON.stringify(json)
  // console.log(input1.value)




  const response = await fetch( '/submit', {
      headers: {"Content-Type": "application/json"},
    method:'POST',
    body  
  }).then( async function (response){
    let newData = await response.json()
    render(newData)

  })



}

const del = function(event){

  event.preventDefault()

  const input1 = document.querySelector( '#name' )
  const input2 = document.querySelector( '#age' ) 
  const input3 = document.querySelector( '#breed' )
  const input4 = document.querySelector( '#favAct' )


  json = { name: "kitty", age: 1, breed: 132, favAct: 12, toBeDeleted: true}

  body = JSON.stringify(json)

  const response = fetch( '/submit', {
      
    method:'POST',
    body
  }).then( async function (response){
    let newData = await response.json()

    if(newData.toBeDeleted===true){
      System.out.println("hey")
    }
     deleteRow(newData)
  
  })



}




window.onload = function() {
   const button = document.querySelector("button");
   const deletebtn = document.getElementById("deletebtn");

  button.onclick = submit;
  deletebtn.onclick = del;


 };

  render = function(newData){
    const table = document.querySelector( '#table');
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td"); 
    var td4 = document.createElement("td"); 
    var td5 = document.createElement("td"); 
    var row = document.createElement("tr");   

     
    td1.innerHTML = document.getElementById("name").value;
    td2.innerHTML = document.getElementById("age").value;
    td3.innerHTML = document.getElementById("breed").value;
    td4.innerHTML = document.getElementById("favAct").value;
    td5.innerHTML  = ageCategory(document.getElementById("age").value);

    row.append(td1);
    row.append(td2);
    row.append(td5);
    row.append(td3);
    row.append(td4);
    
    table.append(row);

   
  }

  deleteRow = function(newData){
    table.deleteRow(1)
   
  }

  function ageCategory(x){
    if(x < 1){
      return "kitten"
    }
    else if(x < 3){
      return "young adult"
    }
    else if(x < 7){
      return "adult"
    }
    else if(x < 10){
      return "mature"
    }
    else if(x < 14){
      return "senior"
    }
    else if(x > 15){
      return "geriatric"
    }

  }
