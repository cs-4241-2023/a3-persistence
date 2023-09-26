const mongoose = require("mongoose");

const Character = mongoose.model(
  "Character",
  new mongoose.Schema({
    name: String,
    attack: Number,
    defense: Number,
    speed: Number,
    average: Number,
    recommended: String,
    username: String
  })
);

module.exports = Character;