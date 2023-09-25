Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===


the hardest things for me were figuring out environment variables and how to use Mongo
I used local storage as my authentication strategy because it was the simplest. Assuming the user inputs a correct password (or creates a new user by logging in for 1st time), the local storage sets an attribute for User that is then used to get the appropriate data from Mongo
I used Water.css because I wanted something that worked out of the box with no configuration
I kept my existing CSS from A2 which centered everything and made the table look better Notes:
only supports deleting and modifying one task at a time
you can modify a task by checking the box next to it and clicking the 'Create/modify task' button

## Your Web Application Title

your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me


I created a todo list with persistent storage using Mongo. The hardest thing was figuring out how to login and make all that work. I used the local storage for authentication becuase I felt that was the easiest to do. And used a CSS called Sakura becuase I thought it looked nice and also added a modifying feature. My application also has a register button to register new accounts. I used 
- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
