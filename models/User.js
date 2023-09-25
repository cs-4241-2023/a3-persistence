// Schema for a food entry

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    caloriesGoal: {
        type: Number,
        required: true,
    },
    proteinGoal: {
        type: Number,
        required: true,
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;