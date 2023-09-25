
## Daily Planning App

your glitch (or alternative server) link e.g. https://a2-emresabz.glitch.me/
https://glitch.com/edit/#!/a2-emresabz?path=public%2Fjs%2Fmain.js%3A188%3A0

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:
This project is a web-based task management application. Users can login with a username and password. Once authenticated, they can:

Add new tasks, specifying the task's description, creation date, and priority level.
View a list of their tasks, which are color-coded based on priority.
Edit existing tasks, updating their description, priority, or creation date.
Delete tasks from their list.
Mark tasks as completed using a checkbox, which updates their status in the database.
Logout, returning them to the login screen.

- the goal of the application
- challenges you faced in realizing the application
  Using mongoDB proved challenging sometimes with indexing for my tasks
- what CSS framework you used and why
  I used bootstrap
  - include any modifications to the CSS framework you made via custom CSS you authored
    body {
    background-color: lightblue;
    font-family: 'Oswald', sans-serif;
}
#login-box {
    margin-bottom: 20px;
}
#task-bar, #task-list {
    margin: 10px 0;
}
.task-item {
    margin-bottom: 10px;
}
.task-item {
  width: 60%;
  margin: 10px auto;  /* Centers the task */
  /* ... other styles remain the same */
}
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.
body-parser: body-parser is used to parse incoming request bodies in JSON and URL-encoded formats, making it easier to work with request data.
express.static: express.static is used to serve static files (e.g., HTML, CSS, JavaScript, images) from a specified directory, such as your "public" directory.
MongoClient.connect (Custom Middleware): This custom middleware establishes a connection to a MongoDB database using the MongoDB Node.js driver, and it sets the db variable to the database instance.
app.use(bodyParser.json()): This middleware specifically parses incoming request bodies as JSON, allowing you to access JSON data in your request handlers.
app.use(bodyParser.urlencoded({ extended: true })): This middleware parses incoming request bodies when data is submitted as URL-encoded form data, which is often used in HTML forms.

![image](https://github.com/EmreSab/a3-persistence/assets/68355390/daa4e7c9-4753-4186-a058-b5d9b986fa80)
