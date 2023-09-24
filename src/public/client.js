let currentlyEditingPostId = null;
const buttonStyle = 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-0.5 px-1.5 rounded';

const displayPosts = function () {
    axios
        .get('/api/blogs')
        .then((response) => {
            const data = response.data;

            const blogPostsSection = document.getElementById('blog-posts');
            blogPostsSection.innerHTML = '';

            data.forEach((blogPost) => {
                const blogPostDiv = document.createElement('div');
                blogPostDiv.classList.add('blog-post'); // Add a class for styling
                blogPostDiv.id = `blog-post-${blogPost._id}`; // Unique ID for each post
                blogPostDiv.innerHTML = `
                    <h3>${blogPost.title}</h3>
                    <p>id: ${blogPost._id}</p>
                    <p>Reading Time: ${blogPost.readingTime} min</p>
                    <p id="content-${blogPost._id}">${blogPost.content}</p>
                    <button onclick="editPost('${blogPost._id}')" class="${buttonStyle}">Edit</button>
                    <button onclick="deletePost('${blogPost._id}')" class="${buttonStyle}">Delete</button>
                `;

                blogPostsSection.appendChild(blogPostDiv);
            });
        })
        .catch((error) => {
            console.error('Failed to fetch blog posts', error);
        });
};

const createPost = function (event) {
    event.preventDefault();

    const titleInput = document.querySelector('#title');
    const contentInput = document.querySelector('#content');

    const blogPost = {
        title: titleInput.value,
        content: contentInput.value,
    };

    axios
        .post('/api/blogs', blogPost, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(() => {
            console.log('Blog post created successfully');
            titleInput.value = '';
            contentInput.value = '';
            displayPosts(); // Fetch and display updated blog posts
        })
        .catch((error) => {
            console.error('Failed to create blog post', error);
        });
};

const editPost = function (postId) {
    const blogPostDiv = document.querySelector(`#blog-post-${postId}`);
    const titleElement = blogPostDiv.querySelector('h3');
    const contentElement = blogPostDiv.querySelector(`#content-${postId}`);

    // Create form elements for editing
    const editForm = document.createElement('form');

    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Title:';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = titleElement.textContent;

    const contentLabel = document.createElement('label');
    contentLabel.textContent = 'Content:';
    const contentInput = document.createElement('textarea');
    contentInput.rows = '4';
    contentInput.value = contentElement.textContent;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = function () {
        updatePost(postId);
    };

    // Replace the existing elements with form fields
    blogPostDiv.innerHTML = '';
    blogPostDiv.appendChild(editForm);
    editForm.appendChild(titleLabel);
    editForm.appendChild(document.createElement('br'));
    editForm.appendChild(titleInput);
    editForm.appendChild(document.createElement('br'));
    editForm.appendChild(contentLabel);
    editForm.appendChild(document.createElement('br'));
    editForm.appendChild(contentInput);
    editForm.appendChild(document.createElement('br'));
    editForm.appendChild(saveButton);
};

const updatePost = function (postId) {
    event.preventDefault();
    
    const editedTitle = document.querySelector(`#blog-post-${postId} input[type="text"]`).value;
    const editedContent = document.querySelector(`#blog-post-${postId} textarea`).value;

    const updatedBlogPost = {
        title: editedTitle,
        content: editedContent,
        _id: postId,
    };

    axios
        .put(`/api/blogs/${postId}`, updatedBlogPost, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(() => {
            console.log('Blog post updated successfully');
            displayPosts(); // Fetch and display updated blog posts
        })
        .catch((error) => {
            console.error('Failed to update blog post', error);
        });
};

const deletePost = function (postId) {
    axios
        .delete(`/api/blogs/${postId}`)
        .then(() => {
            console.log(`Blog post id:${postId} deleted successfully`);
            displayPosts(); // Fetch and display updated blog posts
        })
        .catch((error) => {
            console.error('Failed to delete blog post', error);
        });
};

const hideAllPosts = function () {
    const blogPostDivs = document.querySelectorAll('.blog-post');
    blogPostDivs.forEach((div) => {
        if (div._id !== `blog-post-${currentlyEditingPostId}`) {
            // Only hide posts that are not being edited
            div.style.display = 'none';
        }
    });
};

window.onload = function () {
    const createButton = document.querySelector('#create-button');
    createButton.onclick = createPost;

    displayPosts();
};
