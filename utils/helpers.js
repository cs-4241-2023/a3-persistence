const bcrypt = require("bcryptjs");

// hash the password
function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

// compare the password with the hash
function comparePasswords(password, hash) {
  return bcrypt.compareSync(password, hash);
}

// calculate the duration between two dates
function duration(date1, date2) {
  const diffTime = date2 - date1;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

module.exports = {
  hashPassword,
  comparePasswords,
  duration,
};
