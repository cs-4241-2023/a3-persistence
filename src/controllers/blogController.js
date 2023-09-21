const BlogPost = require('../models/BlogPost');

// Controller functions
exports.getAllBlogPosts = async (req, res) => {
    try {
        const blogPosts = await BlogPost.find();
        res.status(200).json(blogPosts);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

exports.createBlogPost = async (req, res) => {
    const blogPostData = req.body;
    blogPostData.readingTime = calculateReadingTime(blogPostData.content);

    try {
        const newBlogPost = new BlogPost(blogPostData);
        await newBlogPost.save();
        res.status(200).send('Blog post created successfully');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

exports.updateBlogPost = async (req, res) => {
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
};

exports.deleteBlogPost = async (req, res) => {
    const postId = req.params.id;

    try {
        await BlogPost.findByIdAndDelete(postId);
        res.status(200).send(`Blog post id:${postId} deleted successfully`);
    } catch (error) {
        res.status(404).send('Blog post not found');
    }
};

function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}
