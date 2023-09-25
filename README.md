Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===


## Grocery List

Glitch link: https://a3-julie-vieira.glitch.me/?

Summary:

This application is a grocery list that tracks the user's desired items and the cost associated with each items as well as the purchase as a whole compared to a budget.
The user is initially met with a login page to enter a username and password. If they have not already created an account, a new account will be created. Otherwise, they will be
prompted that the incorrect password was entered or that the login was successful. A user names "user" with password "pass" has already been created and filled with some sample data.
The data storage is persistent for each user so that they are able to return to their shopping
list at any point to add, delete, or modify items. In order to modify an item, the user must fill out the form and select the modify button next to the item they wish to update.
Some challenges that were encountered in setting up the server using mongodb were that I had to figure out how the json objects were being passed between the client and server.
In A2, we simply pushed new items onto a stack. However, in this version, each item needed to be parsed in a different manner and I had to use Object.value to obtain the correct
information. However, it was much better to have id's associated with each object when deleting and updating. I also sturggled when attempting authentication. I initially
attempted to use Bcrypt and was successfully generating and storing the hashed keys. However, using the bcrypt compare method was challenging because the connection was getting
interrupted before the comparison could be completed. I pivoted to using cookies and handlebars as outlined in the document through the class Github. Although it certainly took
more time than bcrypt would have had the compare function worked, the implementation of cookies and handlebars was much easier to figure out as I went along. Teh CSS framewor
I included was Bootstrap. The main purpose of Bootstrap in this project is aligning elements and manipualting them as the size of the screen changes while more of the specific
details from A2 were carried over. This includes the colors and use of flexboxes for organization. The two Express middleware packages used were cookie-session and express-handlebars.
Cookie session keeps a record of the information uses the keys (which were changed to hash codes) to provide some security through encryption of data during the session that the
user is logged in. Handlebars not only provides separation between the UI and code, but it also gives access to features like render which helped to switch between pages and send
messages, like if a new account was created.

## Technical Achievements
- **Tech Achievement 1**: N/a

### Design/Evaluation Achievements
- **Design Achievement 1**: N/a
