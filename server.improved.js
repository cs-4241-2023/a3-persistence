
// server
const express = require("express"),
  app = express(),
  playlists = [
    { season: "fall", title: "1901", artist: "Phoenix", length: "2:00" },
  ];

app.use(express.static("public"));
app.use(express.static("views"));
app.use(express.json());

app.post("/remove", (req, res) => {
  for (let i = 0; i < playlists.length; i++) {

    if (
      playlists[i].title === req.body.title &&
      playlists[i].artist === req.body.artist &&
      playlists[i].length === req.body.length &&
      playlists[i].season === req.body.season
    ) {
      playlists.splice(i, 1);
    }
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(playlists));
});

app.post("/submit", (req, res) => {
  const length = req.body.length;
  const minutes = Math.floor(length / 60).toString();

  const seconds = (length % 60).toString();

  let finalTime = "";

  if (seconds < 10) {
    finalTime = minutes + ":0" + seconds;
  } else {
    finalTime = minutes + ":" + seconds;
  }

  req.body.length = finalTime;

  playlists.push(req.body);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(playlists));
});

app.post("/nothing", (req, res) => {
  //do nothing
})

app.listen(process.env.PORT);
