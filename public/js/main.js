// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function (event) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault();

  const mTitle = document.querySelector("#mTitle").value,
    mLength = document.querySelector("#mLength").value,
    mYear = document.querySelector("#mYear").value;

  const json = {
      mTitle: mTitle,
      mLength: mLength,
      mYear: mYear,
    },
    body = JSON.stringify(json);

  const addMovie = await fetch("/submit", {
    method: "POST",
    headers:{ "Content-Type": "application/json" },
    body,
  });
  const data = await addMovie.json();
  showData(data)
};

function showData(data){
const list = document.createElement("table");

  const rowHead = document.createElement("tr");
  const movieHead = document.createElement("th");
  const lengthHead = document.createElement("th");
  const yearHead = document.createElement("th");
  const ageHead = document.createElement("th");
  movieHead.innerText = "Movie Title";
  lengthHead.innerText = "Movie Length";
  yearHead.innerText = "Movie Year";
  ageHead.innerText = "Movie Age";

  rowHead.appendChild(movieHead);
  rowHead.appendChild(lengthHead);
  rowHead.appendChild(yearHead);
  rowHead.appendChild(ageHead);
  list.appendChild(rowHead);

  document.body.appendChild(list);

  data.forEach((d) => {
    const row = document.createElement("tr");
    const mLen = document.createElement("td");
    const mYear = document.createElement("td");
    const mAge = document.createElement("td");

    
    row.innerHTML = d.mTitle;
    
    if(d.mLength == ""){
      mLen.innerHTML = "-"
    }else{
      mLen.innerHTML = d.mLength;
    }
    
    if(d.mYear == ""){
      mYear.innerHTML = "-"
    }else{
      mYear.innerHTML = d.mYear;
    }
    
    if(d.mAge == null){
      mAge.innerHTML = "-"
    }else{
      mAge.innerHTML = d.mAge;
    }

    row.appendChild(mLen);
    row.appendChild(mYear);
    row.appendChild(mAge);
    list.appendChild(row);
  });
}

const deleteF = async function (event) {
  event.preventDefault();
  
 const mTitle = document.querySelector("#mTitle").value,
        mLength = document.querySelector("#mLength").value,
        mYear = document.querySelector("#mYear").value;
  
   const json = {
      mTitle: mTitle,
     mLength: mLength,
     mYear: mYear,
   }
  const body = JSON.stringify(json);
  const deleteMovie = await fetch("/delete", {
      method: "POST",
      headers:{ "Content-Type": "application/json" },
      body
    });
   const data = await deleteMovie.json();
  showData(data);
  };

const modifyM = async function (event){
  event.preventDefault();
  const mTitle = document.querySelector("#mTitle").value,
        mLength = document.querySelector("#mLength").value,
        mYear = document.querySelector("#mYear").value;
  
   const json = {
      mTitle: mTitle,
     mLength: mLength,
     mYear: mYear,
   }
   
  const body = JSON.stringify(json);
  
  const modifyMovie = await fetch("/modify", {
    method: "POST",
    headers:{ "Content-Type": "application/json" },
    body
  });
  const data = await modifyMovie.json();
  showData(data);
}

window.onload = function () {
  const addButton = document.querySelector("#add");
  addButton.onclick = submit;

  const deleteButton = document.querySelector("#delete");
  deleteButton.onclick = deleteF;
  
  const modifyButton = document.querySelector('#modify');
  modifyButton.onclick = modifyM;
};
