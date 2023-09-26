const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true, primary: true },
    githubId: String,
    title: String,
    content: String,
    readingTime: Number,
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
