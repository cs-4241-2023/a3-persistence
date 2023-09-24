const { Router } = require("express");

const router = Router();

router.post("/login", (req, res) => {
  // console.log(req.body);
  const { username, password } = req.body;
  if (username && password) {
    if (req.session.user) {
      res.send(req.session.user);
    } else {
      req.session.user = {
        username,
      };
      res.send(req.session);
    }
  } else {
    res.send(401);
    res.end();
  }
});

router.post("/register", (req, res) => {});
