const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  console.log(req.body.username)
  console.log(req.body.password)
  const user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save({user}).then((user) => {
    res.send({ message: "User was registered successfully!" });
    return;
  }).catch((err) => {
      res.status(500).send({ message: err });
      return;
  });
    
};

exports.signin = (req, res) => {
    User.findOne({
      username: req.body.username
    }).then ((user) => {
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
      
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        const token = jwt.sign({ id: user.id },
            config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400, // 24 hours
            });
    
        res.status(200).send({
            id: user._id,
            username: user.username,
            accessToken: token
        });
      }).catch((err) => {
        res.status(500).send({ message: err });
        return;
      });
    /* if (!user) {
        return res.status(404).send({ message: "User Not found." });
    } */
  
    
};
  
