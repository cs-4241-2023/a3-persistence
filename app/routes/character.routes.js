const auth = require("../middleware/auth");
const controller = require("../controllers/character.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/character/add", [auth.verifyToken], controller.add);
  app.post("/api/character/delete", [auth.verifyToken], controller.delete);
  app.post("/api/character/getCharacters", [auth.verifyToken], controller.getCharacters);
};