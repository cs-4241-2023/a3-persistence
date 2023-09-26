const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const User = db.user;

verifyToken = (request, response, next) => {
  let token = request.headers["x-access-token"];

  if (!token) {
    return response.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token,
            config.secret,
            (err, decoded) => {
              if (err) {
                return response.status(401).send({
                  message: "Unauthorized!",
                });
              }
              request.userId = decoded.id;
              next();
            });
};

const auth = {
    verifyToken
  };
module.exports = auth;
  