// FRONT-END (CLIENT) JAVASCRIPT HERE

const submit = async function( event ) {
  // stop form submission from trying to load
  // a new .html page for displaying results...
  // this was the original browser behavior and still
  // remains to this day
  event.preventDefault()
  
  const item = document.querySelector( '#item' );
  const rating = document.querySelector( '#rating' );
  const image = document.querySelector( '#image' );
  const json = {
    item: item.value,
    rating: Number(rating.value),
    image: image.value,
  };
  const body = JSON.stringify( json );

  const response = await fetch( '/submit', {
    method: 'POST',
    body,
    headers: {'Content-Type': 'application/json'},
  });

  let data = await response.json();
  updatePage(data);
}

const updatePage = function(data) {
  let dataTable = document.querySelector("#data-table");
  let oldBody = dataTable.querySelector("tbody");
  if (oldBody !== null) {
    dataTable.removeChild(oldBody);
  }
  let newBody = document.createElement("tbody");
  data.forEach((row) => {
    let tableRow = newBody.insertRow();
    if (row.tier === "S") {
      tableRow.classList.add("purple");
    } else if (row.tier === "A") {
      tableRow.classList.add("blue");
    } else if (row.tier === "B") {
      tableRow.classList.add("green");
    } else if (row.tier === "C") {
      tableRow.classList.add("yellow");
    } else if (row.tier === "D") {
      tableRow.classList.add("orange");
    } else {
      tableRow.classList.add("red");
    }


    let imageCell = tableRow.insertCell();
    let image = document.createElement("img");
    image.src = row.image;
    image.height = 64;
    image.width = 64;
    image.alt = `User inputted image representing ${row.item}`;
    imageCell.appendChild(image);

    let item = tableRow.insertCell();
    item.textContent = row.item; 

    let rating = tableRow.insertCell();
    rating.textContent = row.rating; 

    let tier = tableRow.insertCell();
    tier.textContent = row.tier; 

    let actionsCell = tableRow.insertCell();

    let editButton = document.createElement("button");
    editButton.textContent = "✏️";
    editButton.onclick = function() {
      const item = document.querySelector( '#item' );
      item.value = row.item;
      const rating = document.querySelector( '#rating' );
      rating.value = row.rating;
      const image = document.querySelector( '#image' );
      image.value = row.image;
    }

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";
    deleteButton.onclick = async function() {
      const response = await fetch('/delete', {
        method: 'POST',
        body: JSON.stringify({item: row.item}),
        headers: {'Content-Type': 'application/json'},
      })
      let data = await response.json();
      updatePage(data);
    }

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
  });
  dataTable.appendChild(newBody);
}

window.onload = async function() {
  const response = await fetch( '/fetch', {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {'Content-Type': 'application/json'},
  })
  let data = await response.json();
  updatePage(data);

  const button = document.querySelector("#submit");
  button.onclick = submit;
}
