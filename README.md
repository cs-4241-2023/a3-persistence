## Bucket List

https://a3-matthew-lacadie.glitch.me/

Professor gave me an extension until 11:59 9/25

This is a site where you can make a bucket list for achievments that you want to complete.
Type the action in the text box and press submit to add it to the table.
If the button in the completed tab is pressed, the completion value will change to yes and the derrived field, "Date Completed" will show when you completed the task.
the button in the remove tab allows you to delete the Action from the list.

Username: Username
Password: Password was used for testing and already has some values stored in the database.
to register as a new user simply log in with your desired username and password and start adding to your bucket list

Using cookies was the most challenging part for me. Since I decided to use a single page setup for logging in and out, the session would not save.
I kept trying to save the username and password in req.session.username and req.session.password respectivley but they kept coming out as null when called.
I decided to store the username and password in local variables to find the user's information from the database, which isn't the most secure but I was running late on the submission.

To authenticate users, I simply used the username/password method and stored both values everytime a new submission was made so that we can find the user in the database and list all of thier actions.
The site will not let you login if the username and/or password boxes are left empty. I did it this way out of conviniency taking time into account.

The CSS framework I used is bootstrap. I used bootstrap because I have used it twice before, in softeng and in my internship over the summer so I was already well versed on how to use it.
Bootstrap is also very well documented so it was easy to find any errors that I was commiting when writing.
The only modifiacations I made to the framework were the background color to the site and the table headers adn the table allignment and border colors.

The express middleware packages used were express itself which provided the other packages for us to conviniently handle dataflow and server logic, express.static: which helped easliy and automatically convert
"/" into "./index.html", express.json: which helped parse JSON data from the requested body, and then express.urlencoded and cookie-session which were not used in the final product but would have served
for session managment.

I uploaded a screenshot of my locla lighthouse test to the assests page on glitch
https://cdn.glitch.global/db7315a0-8474-49dc-aacf-f842061bc606/Screenshot%202023-09-25%20134930.jpg?v=1695664185370


## Technical Achievements
- **Tech Achievement 1**:

### Design/Evaluation Achievements
- **Design Achievement 1**: 
