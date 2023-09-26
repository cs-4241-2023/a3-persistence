## README

Reached out to professor and TA and was approved for project extension.

## To do List
Ran into errors when exporting from Visual Studio Code to glitch. Was able to get this application to run on my machine by typing "npm run start" into the terminal with all files open. If successful, the console logs "Running on port 5000" and "Database successfully connected", and the application can be opened using url "localhost:5000" in google chrome browser.
Please reach out to me if any problems running on grader's device, as in that case I would like to meet in person and show how program runs on my local device.

The goal of this application is to provide a to do list where users can add tasks, the date due, and the time due for the task.
This application has a log in system that prompts the user to enter a username and password. If it is a new username, the username and password is stored in the MongoDB database using mongoose, and alerts that a new user was created. If it is an existing username, the program checks if the password is correct, and logs the user in if it is. If the password is incorrect, the user is alerted that they have entered an incorrect password. If the user leaves either of these fields blank, they are alerted to fill in both fields.

One of the main challenges I faced during this was being able to add multiple tasks, dates, and times that are stored for a specific user. It was difficult for me to find out how to store new information in MongoDB for the specific logged in user, and to figure out how to add new tasks, instead of replacing one. This was solved by making each task, date, and time an array in the user mongoose schema, and then finding the corresponding user and pushing the added task information to each array.

I did not use any OAuth for my application, instead authenticating users by looking into the database and seeing if the username exists, and if so checking if the password entered corresponds to the user. I used an extension bcrypt to hash the passwords in the database, making them more secure.

I used Bootstrap CSS framework, as it was one of the most popular ones and I had some experience already using it. 

Criteria:
Have proper naming convention.
README contains required information.
Gathered data through HTML forms (username, password, task, date, time).
Users are able to add new tasks into MongoDB, but not edit or delete.
Fetched multiple server requests with app.get and app.post in server.js
Styles all pages solely using Bootstrap.
Persistent data on local machine using MongoDB mongoose. User login information and all tasks associated with them is stored and saved.
Used express js and mongodb middleware throughout in server.js and users.js files.
Currently does not display data to users.
Site accessible design achievement.


## Achievements

## Technical Achievements
N/A

**Design Achievements**
I actively ensured to use 12 tips from W3C to make my site accessible.
1. Developing Tip: Associated a label with every form control.
2. Developing Tip: Helped users avoid and correct mistakes through error messages (Alerts to fill in required fields when not filled in, alerts telling user when they have entered incorrect password).
3. Developing Tip: Wrote code that adapts to users technology (Used Bootstrap to make 3 required task information all on one line for wide screens, separate line for smaller screens).
4. Designing Tip: Provided sufficient contrast between foreground and background using light foreground and dark text.
5. Writing Tip: Provided clear instructions through error messages when the user has made a mistake.
6. Designing Tip: Provided clear and consistent navigations options through buttons.
7. Designing Tip: Ensured that each form element has a clearly associated label
8. Designing Tip: Created designs for different viewport sizes using Bootstrap
9. Writing Tip: Kept content clean and concise (concise login page, clean main page not overflooded with information)
10. Designing Tip: Made interactive elements easy to identify (Buttons, mouse changes on hover making it clear that it can be clicked)
11. Designing Tip: Did not use color alone to convey information (Used asteriks on all required fields, with message below in red saying "Required fields marked with a *")
12. Writing Tip: Used headings to convey meaning and structure (Login heading for login page, To do list heading for main page -> both describe main meaning and goal of page)
