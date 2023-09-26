const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const DB = {};

DB.mongoose = mongoose;

DB.user = require("./user.model");
DB.character = require("./character.model");

module.exports = DB;