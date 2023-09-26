const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    githubId: String, // Store GitHub user ID
    username: String, // Store GitHub username
});

const User = mongoose.model('User', userSchema);

module.exports = User;
