## TO-DO App

https://a2-nathanwong.glitch.me/

### Goal
This project allows users to create TODO tasks which will be stored on a database connected to an account they make on the webpage. Users have the ability to add, modify, and delete the tasks that they make under their account.

Using the app:
- A user can login by clicking the login button at the top right
- The user can then choose to create a new account (Sign Up) or login to an existing account (Sign In)
- After logging in, the user can view tasks they created from a previous session or they can add new tasks using the input fields at the top of the page
- A user can also delete (-) and update (+) tasks by clicking on the corresponding buttons located at the right of each task
- A user can log out of their account by clicking the red button that displays their username

### Challenges
The biggest challenge I faced when making the application was getting authentication implemented. I struggled with implementing all the logic required to safely create and store information pertaining to an account and how to connect an account to its corresponding data from the server to the client side.

### Authentication
I used a simple strategy for authentication. The strategy included allowing users to create and login to their account from the webpage. A user would submit their username and password which would be checked against a database to log a user in and grab the corresponding data. This method was used because it was the simplest to implement.

### CSS Framework
I used the Bulma CSS framework for this project because it allows developers to make form and form elements very easily. Since my application utilized multiple different fields to create, update, and delete tasks, I believed that Bulma would provide the framework to facilitate the process of creating these forms and inputs.

### Middleware
I used 5 different middlewares for this project:
- express.static: this middleware serves HTML, CSS, and JS files to the client side to load the webpage.
- morgan: this middleware logs the request url, the method type, status code, and the time it took for the request to finish in the console of the server.
- express.json: this middleware parses request body data in the JSON format and allows it to be accessed in `req.body`.
- connect-timeout: this middleware ends a request if the request exceeds a certain time limit to finish.
- database connection (custom): this custom made middleware checks that the connection that is produced after connecting to a MongoDB collection is not null.

## Baseline Requirements

All baseline requirements for this project have been fulfilled.
- A `server` created using express
- A `results` area on the webpage (the task list) that shows all the data associated with a user
- A `form/entry` is used and encapsulates all the input fields found in the top of webpage and these help with adding, updating, and deleting all data associated with a user
- A MongoDB database is used to handle `persistent data` and the application will retain all the tasks created by a user even after refreshing the page or logging out
- A `CSS framework` is used (Bulma CSS)

### HTML
- Various flavors of input tags are used (`input` and `select`)
- The list box in the HTML is responsible for showing all tasks associated with a user

### CSS
- Bulma CSS was used as a framework to create the webpage

### JavaScript
- Multiple post, get, and fetch requests are used to load and update data on the application and database

### Node.js
- Express is used for the server and persistent data is stored using MongoDB

### General
- This website passes all four Google Lighthouse test categories and scores above 90%

## Technical Achievements
- **Tech Achievement 1**: This website scores 100% for all four required tests in Google Lighthouse. Images have been provided in this repository as proof (also just in case of any hardware differences when the grader confirms on their end)

- **Tech Achievement 2**: 

## Design Achievements

