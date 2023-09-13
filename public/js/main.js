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
    headers: { 'Content-Type': 'application/json' },
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
    pop.style.cssText = "margin:0 auto 0 25%;display:grid;";
    if (current_season === d.season) {
      item.innerHTML = `${d.title} by ${d.artist}: ${d.length}`;
      list.appendChild(item);

      pop.innerHTML = `Delete`;
      pop.onclick = async function (event) {
        event.preventDefault();
        const removeJson = {
            season: d.season,
            title: d.title,
            artist: d.artist,
            length: d.length,
          },
          removeBody = JSON.stringify(removeJson);

        const removeResponse = await fetch("/remove", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: removeBody,
        });

        const responseData = await removeResponse.json();
        createPlaylist(responseData);
      };
      item.appendChild(pop);
    } else {
      document.getElementById("output").innerHTML = "";
    }

    header.innerHTML = `${d.season} playlist`;
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

window.onload = async function () {
  const current_season = document.getElementById("season").value;
  const addButton = document.getElementById("add");
  addButton.onclick = add;

  const doesNothing = await fetch("/nothing", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
};