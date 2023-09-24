## TO-DO App

https://a3-nathanwong.glitch.me/

**An admin account has been created for testing purposes (username: admin, password: admin)**

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

- **Tech Achievement 2**: I implemented my own hash function to ensure security of user accounts. When a user either logs in or create an account, the client-side will hash the password before sending the POST request to the server. Therefore, a user's password cannot be exposed even if the request is intercepted or if the database is compromised (see lines 2-12 in main.js). I believe this achievement should be awarded 2 points.

- **Tech Achievement 2**: 

## Design Achievements
### CRAP Principles
- Contrast: I implemented contrast in my application through a contrast of colors and prominent borders. Inside the header of the application, each input field displays its prominence through the use of labels with bold, black text. These labels contrast against the white background in the header to help bring attention to the input fields. Each input field also uses a gray border to contrast against the white header to mark the start and end of each  field. Alongside the input fields, I have an "add" button that has a green background. This button color has high contrast with the header background and it also contrasts with the color scheme of the input fields to showcase the different function of the button compared to the input fields. Likewise, the "log in" button has a differing color from the "add" button and input fields to once again show it has a different function from the other elements in the header. Lastly, the result table in the middle of the page has a gray border and white background to help contrast against the light green backdrop in the remainder of the page. All of these examples of help the user distinguish key features within the webpage.

- Repetition: I implemented repetition in my application through the use of similar styles on all input fields. All input fields found throughout header and the log in modal window use the same Bulma style. This repetition of styles allows the user to easily recognize when a text input is required of the user. The tasks in the result box of the webpage also use repetition. Each task that is displayed uses the exact same format where the name, due date, days remaining, priority, modify button, and delete button are all shown horizontally on the result box. Displaying the tasks in this consistent format allows the user to identify key task information for any task they look at. Additionally, because of repetition, users can easily find the modify and delete task buttons for any task they want to edit.

- Alignment: I implemented alignment in my application through the combination of labels and input fields and displaying tasks. All input fields (either for adding tasks or logging in) are accompanied by a label. These labels are always placed above their corresponding input fields, and they are left aligned with their input fields. This type of alignment allows users to easily understand which labels are describing which input fields. Furthermore, the task list also uses alignment for each task. Every task displays a name, due date, days remaining, priority, modify button, and delete button; all of these elements of the task are aligned horizontally with each other. Furthermore, the name of each task are aligned vertically with all other tasks (this is the same for every element in each task). This alignment helps organize the information of each task and helps users easily find the modify and delete buttons for each task as they can be found in the same place for every task.

- Proximity: I implemented proximity in my application by grouping input fields and buttons together. When the user wants to add a task they must first fill out all input fields and click the "add" button. These input fields are visually close to the "add" button which helps indicate that the values in the input fields are used by the "add" button. The login modal also uses proximity as the input fields for username and password are close to the buttons that handle logging a user in. The "Log In" button uses proximity in the opposite manner; the "Log In" button is placed away from all other elements in the webpage as the "Log In" button has functionality that does not rely on other information on the page.