const http = require('http');
const fs = require('fs');
const mime = require('mime');
const dir = 'public/';
const port = 3000;

let nextBlogPostId = 1; // Initialize the unique ID counter
const blogData = [];

const server = http.createServer(function (request, response) {
    if (request.method === 'DELETE') {
        const postId = request.url.slice(8);
        handleDelete(postId, response);
    } else if (request.method === 'PUT') {
        const postId = request.url.slice(8); // Extract postId from URL
        updateBlogPost(postId, request, response);
    } else if (request.method === 'GET' && request.url === '/fetch') {
        getAllPosts(request, response);
    } else if (request.method === 'GET') {
        handleGet(request, response);
    } else if (request.method === 'POST' && request.url === '/submit') {
        handlePost(request, response);
    }
});

const updateBlogPost = function (postId, request, response) {
    let dataString = '';

    request.on('data', function (data) {
        dataString += data;
    });

    request.on('end', function () {
        const updatedBlogPost = JSON.parse(dataString);

        // Find the blog post by ID and update its title and content
        const index = blogData.findIndex((post) => post.id === parseInt(postId));

        if (index !== -1) {
            blogData[index].title = updatedBlogPost.title;
            blogData[index].content = updatedBlogPost.content;
            blogData[index].readingTime = calculateReadingTime(updatedBlogPost.content);
            response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
            response.end('Blog post updated successfully');
        } else {
            response.writeHead(404, 'Not Found', { 'Content-Type': 'text/plain' });
            response.end('Blog post not found');
        }
    });
};


function calculateReadingTime(content) {
    // Assuming an average reading speed of 200 words per minute
    const wordsPerMinute = 200;

    // Count the number of words in the content
    const wordCount = content.split(/\s+/).length;

    // Calculate reading time in minutes (rounded up)
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return readingTime;
}

const handleDelete = function (postId, response) {
    // Find the blog post by ID and remove it from the blogData array
    const index = blogData.findIndex((post) => post.id === parseInt(postId));

    if (index !== -1) {
        blogData.splice(index, 1);
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.end('Blog post deleted successfully');
    } else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end('Blog post not found');
    }
};

const handleGet = function (request, response) {
    const filename = dir + request.url.slice(1);

    if (request.url === '/') {
        sendFile(response, 'public/index.html');
    } else {
        sendFile(response, filename);
    }
};

const handlePost = function (request, response) {
    let dataString = '';

    request.on('data', function (data) {
        dataString += data;
    });

    request.on('end', function () {
        const blogPost = JSON.parse(dataString);
        blogPost.id = nextBlogPostId++; // Assign a unique ID to the blog post
        blogPost.readingTime = calculateReadingTime(blogPost.content);
        console.log(blogPost)
        blogData.push(blogPost);

        response.writeHead(200, 'OK', { 'Content-Type': 'text/plain' });
        response.end('Blog post created successfully');
    });
};

const getAllPosts = function (request, response) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(blogData));
};

const sendFile = function (response, filename) {
    const type = mime.getType(filename);

    fs.readFile(filename, function (err, content) {
        if (err === null) {
            response.writeHeader(200, { 'Content-Type': type });
            response.end(content);
        } else {
            response.writeHeader(404);
            response.end('404 Error: File Not Found');
        }
    });
};

server.listen(process.env.PORT || port);
