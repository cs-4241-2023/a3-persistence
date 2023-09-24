const { Router } = require("express");
const { hashPassword } = require("../utils/helpers");

const router = Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Missing email or password");
  }
});

router.post("/register", (req, res) => {});
