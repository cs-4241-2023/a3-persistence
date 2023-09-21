const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true, primary: true },
    title: String,
    content: String,
    readingTime: Number,
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
