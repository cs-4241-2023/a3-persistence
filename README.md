Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS Template  
===

Nicholas Heineman

---

## Character Manager

This project is a mockup/beginnings of a website that could be used to manage characters for someone creating a book or a game with history they want to keep track of. It is specifically focused around keeping track of time, and one can create, delete and modify eras on the timeline that appears to the right. Then, any characters they create will be sorted into the eras on the timeline with real time updating.

## Project Structure:
Two HTML files, 
-index.html, used to structure both the two tabs and the timeline.
-login.html, used to log a user in and handle github OAuth.

one js file to manage the server, database, OAuth, and other miscellaneous, server.improved.js

3 js/css file pairs:
-main.css/main.js, used to handle styling and code for the main page
-timeline.css/timeline.js, handling styling and code for the timeline
-characterSheet.css/characterSheet.js, handling stylnig and code for the character sheet.

## Functionalities Implemented:
-Server, contained in server.improved.js, updated to use Express
-Results: this is presented in multiple screens, but the two datasets are visible from the characters tab, and the timeline is always visible. It is differentiated between users, and logging in to one or another will display different data
-Form/Entry: both sets of data have from/entry capability, which is done by filling in the form boxes and clicking submit. (keyed to different users still)
-Persistent Data Storae in mongoDB
-CSS Framework/Template: Uses Bootstrap for various formatting things
-Login: can enter values and enter 'sign-in', then use those same values to 'login'

## Concepts Implemented:
-HTML: content contained in index.html/login.html, data is presented 
-CSS:
    -Used all of the CSS selector types, including connecting to classes, and elements
    -styled and positioned all of the elements, used non-default font
    -all CSS content in seperate stylesheets organized in a way I thought made sense
-Javascript
    -code that fullfills the requirement of sending/receiving data
-Node.js
    -fullfills the requirements of creating the derived fields
-General
    -acheived at least 90% on all Lighthouse requirements (see further notes below)

## Achievements:
-10 Points: implement OAuth authentication. Used Github, simply click the 'login with github' button on the login screen and it will add your credentials to the database and log you in. (If you are already signed into github, it may go through automatically, sometimes I had to sign out of github to see the screen)
-5 Points: 100% in lighthouse tests. I got 100% on both pages when using the Localhost variety. However, my performance would drop to 99% when using . 


