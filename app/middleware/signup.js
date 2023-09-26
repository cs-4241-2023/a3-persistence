const db = require("../models");
const User = db.user;

checkDuplicateUsername = (request, response, next) => {
  // Username
  User.findOne({ username: request.body.username }).then ((user) => {
    if (user) {
      response.status(400).send({ message: "Failed! Username is already in use!" }); 
    }
  }).catch((err) => {
    response.status(500).send({ message: err });
    return;
  });
  
  next();
};

const signup = {
    checkDuplicateUsername
  };
  
  module.exports = signup;