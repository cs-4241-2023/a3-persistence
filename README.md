Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS Template  
===

Nicholas Heineman

Link: https://character-tracker.glitch.me/

---

## Character Manager

This project is a mockup/beginnings of a website that could be used to manage characters for someone creating a book or a game with history they want to keep track of. It is specifically focused around keeping track of time, and one can create, delete and modify eras on the timeline that appears to the right. Then, any characters they create will be sorted into the eras on the timeline with real time updating.

## Project Structure:
Two HTML files, <br>
-index.html, used to structure both the two tabs and the timeline.<br>
-login.html, used to log a user in and handle github OAuth.<br>

one js file to manage the server, database, OAuth, and other miscellaneous, server.improved.js<br>

3 js/css file pairs:<br>
-main.css/main.js, used to handle styling and code for the main page<br>
-timeline.css/timeline.js, handling styling and code for the timeline<br>
-characterSheet.css/characterSheet.js, handling stylnig and code for the character sheet.<br>

## Functionalities Implemented:
-Server, contained in server.improved.js, updated to use Express<br>
-Results: this is presented in multiple screens, but the two datasets are visible from the characters tab, and the timeline is always visible. It is differentiated between users, and logging in to one or another will display different data<br>
-Form/Entry: both sets of data have from/entry capability, which is done by filling in the form boxes and clicking submit. (keyed to different users still)
-Persistent Data Storae in mongoDB<br>
-CSS Framework/Template: Uses Bootstrap for various formatting things<br>
-Login: can enter values and enter 'sign-in', then use those same values to 'login'<br>

## Concepts Implemented:
-HTML: content contained in index.html/login.html, data is presented <br>
-CSS:<br>
    -Used all of the CSS selector types, including connecting to classes, and elements<br>
    -styled and positioned all of the elements, used non-default font<br>
    -all CSS content in seperate stylesheets organized in a way I thought made sense<br>
-Javascript<br>
    -code that fullfills the requirement of sending/receiving data<br>
-Node.js<br>
    -fullfills the requirements of creating the derived fields<br>
-General<br>
    -acheived at least 90% on all Lighthouse requirements (see further notes below)<br>

## Achievements:
-10 Points: implement OAuth authentication. Used Github, simply click the 'login with github' button on the login screen and it will add your credentials to the database and log you in. (If you are already signed into github, it may go through automatically, sometimes I had to sign out of github to see the screen)<br>
-5 Points: 100% in lighthouse tests. I got 100% on both pages when using the Localhost variety. However, my performance would occasionally drop to 99% when using the glitch interface, as there was an error that was supposedly 'not actionable' . I hope this doesn't happen when tested, and I would hope to get most of the points for this one.<br>
![Local Lighthouse Results](lighthouse.png)

