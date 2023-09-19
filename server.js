const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
require('dotenv').config();

app.use(express.json()); // Parse JSON request bodies
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const blogPostSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true, primary: true },
    title: String,
    content: String,
    readingTime: Number,
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);


function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}


app.get('/blogs', async (req, res) => {
    try {
        const blogPosts = await BlogPost.find();
        res.status(200).json(blogPosts);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


app.post('/blogs', async (req, res) => {
    const blogPostData = req.body;
    blogPostData.readingTime = calculateReadingTime(blogPostData.content);

    try {
        const newBlogPost = new BlogPost(blogPostData);
        await newBlogPost.save();
        res.status(200).send('Blog post created successfully');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


app.put('/blogs/:id', async (req, res) => {
    const postId = req.params.id;
    const updatedBlogPostData = req.body;

    try {
        const updatedBlogPost = await BlogPost.findByIdAndUpdate(
            postId,
            updatedBlogPostData,
            { new: true }
        );

        if (updatedBlogPost) {
            res.status(200).send('Blog post updated successfully');
        } else {
            res.status(404).send('Blog post not found');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});


app.delete('/blogs/:id', async (req, res) => {
    const postId = req.params.id;

    try {
        await BlogPost.findByIdAndDelete(postId);
        res.status(200).send(`Blog post id:${postId} deleted successfully`);
    } catch (error) {
        res.status(404).send('Blog post not found');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
