// FRONT-END (CLIENT) JAVASCRIPT HERE

const add = async function (event) {
  event.preventDefault();

  const season = document.getElementById("season").value;
  const songTitle = document.getElementById("title").value;
  const songArtist = document.getElementById("artist").value;
  const songLength = document.getElementById("length").value;
  const json = {
      season: season,
      title: songTitle,
      artist: songArtist,
      length: songLength,
    },
    body = JSON.stringify(json);

  const response = await fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await response.json();
  createPlaylist(data);
};

function createPlaylist(data) {
  const list = document.getElementById("output");
  const header = document.getElementById("header");

  list.innerHTML = "";
  data.forEach((d) => {
    let current_season = document.getElementById("season").value;
    const item = document.createElement("p1");
    const pop = document.createElement("button");
    const edit = document.createElement("button");

    pop.style.cssText = "margin:0 auto 0 25%;display:grid;";

    edit.style.cssText = "margin:0 auto 0 25%;display:grid;";

    if (current_season === d.season) {
      item.innerHTML = `${d.title} by ${d.artist}: ${d.length}`;
      list.appendChild(item);

      pop.innerHTML = `Delete`;
      edit.innerHTML = `Edit`;
      pop.onclick = async function (event) {
        event.preventDefault();

        const removeResponse = await fetch("/remove", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: d._id }),
        });

        const responseData = await removeResponse.json();
        createPlaylist(responseData);
      };

      edit.onclick = async function () {
        
        const id = d._id;
        
        console.log(id);
        
        const inputNewTitle = document.createElement("input");

        inputNewTitle.type = "text";
        inputNewTitle.placeholder = "input the new name here!";
        inputNewTitle.id = "title_input";
        list.appendChild(inputNewTitle);

        const inputButton = document.createElement("button");
        inputButton.innerHTML = "Submit";
        list.appendChild(inputButton);

        inputButton.onclick = async function (event) {
          event.preventDefault();

          const newTitle = document.getElementById("title_input").value;
        

          const removeResponse = await fetch("/edit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({newTitle: newTitle, id: id}),
          });

          const editData = await removeResponse.json();
          createPlaylist(editData);
        };
      };

      item.appendChild(pop);
      item.appendChild(edit);
    } else {
      document.getElementById("output").innerHTML = "";
    }

    if (d.season != undefined) {
      header.innerHTML = `${d.season} playlist`;
    } else {
      header.innerHTML = `No Songs Available`;
    }

    changeHeaderColor(current_season);
  });

  document.body.appendChild(list);
}

function changeHeaderColor(season) {
  const header = document.querySelector("h1");

  if (season === "fall") {
    header.setAttribute("style", "background-color:#F5BB91;");
  } else if (season === "spring") {
    header.setAttribute("style", "background-color:#F0BFD9;");
  } else if (season === "winter") {
    header.setAttribute("style", "background-color:#D2E3F3;");
  } else if (season === "summer") {
    header.setAttribute("style", "background-color:#FAF1D0;");
  }
}

const loadSongs = async function () {
  const season = document.getElementById("season").value;

  const response = await fetch("/load", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ season: season }),
  });

  const data = await response.json();

  console.log(data);

  createPlaylist(data);
};


window.onload = async function () {
  const addButton = document.getElementById("add");
  addButton.onclick = add;
};
