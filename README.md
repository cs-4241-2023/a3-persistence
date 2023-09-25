Nelson Diaz
https://a3-nelson-diaz.glitch.me

## SIMS: Simple Inventory Management System

### Summary
This application is designed to keep track of a store's total inventory, being able to keep track of what items are in stock, how much each costs, and total value of each item's stock. When creating this application I had to learn how to use passport.js for authentication, how to store and access cookies on a client, how to poperly redirect unauthenticated users, and how to perform server-side rendering of HTML files. Each of these took time for me to learn and experiment with as well as tought me a lot about how to perform certain actions in a web application. In addition to all this, I was able to cut out all client-side JavaScript due to the use of server-side rendering and native HTML forms. This means that users are able to have full access and functionallity within my application even if they have JavaScript turned off.

### Authentication
I used passport.js to handle all of the authentication in my application. This authentication comes in two forms, Username/Password login and OAuth GitHub login. By using passport.js both of these types of authentication were very similar to implement. In both cases, if a new user tries to sign in, then a new account will be made for them, indicated by the '(new user)' text in the top-left corner next to their username. Cookies are used to keep track of a user's current sign in session.

<img src="https://github.com/nadiaz2/a3-persistence/blob/main/New_User.png?raw=true" width="700"/>

**Important to note**: If a user is trying to sign-in via Username/Password, a unique username needs to be provided in order for a new account to be created. If a user name that is already in use is entered, then the user is alerted to this fact and will need to try again. A sample account with data has been created for testing purposes (Username: test, Password: 1234).

Passport.js was used as my authentication strategy because it was relativly easy to use and also allows for creating new authentication methods very easily. For example, I likely be able to implement Sign-In With Google functionality very easily if I wanted to. Keeping track of sign-in via cookies was also a simple task and easy to implement.

### CSS Framework
I used Pure.css as my CSS framework for this project. I chose this framework because it was a simple framework that was easy to use without too many bells and whistles. I only authored a small amount of custom CSS that was focused on centering and aligning elements on the page. On the login page, I additionally added CSS to change the background color of the page and draw the user's attention to the center of the page.

### Express Middleware
- **cookie-session**: This enables the use of cookies to store information about the user's current sign-in session.
- **express-handlebars**: This middleware allows the server to render custom html before sending it to the client
- **passport-local**: This allows for Username/Password authentication for users.
- **passport-github**: This allows for OAuth GitHub authentication for users.
- **express.static( 'public' )**: This middleware servers up static files to the client, such as CSS files.
- **express.urlencoded({ extended:true })**: This middleware parses form submissions to the server for easy access of the inputs.


## Technical Achievements

- **Tech Achievement 1**: I implemented OAuth authentication via GitHub into my application. This was done using passport.js. If a new user signs in with their GitHub account a new account will be created. This will be indicated by '(new account)' being displayed at the top left of the screen next to the username. This will remain until the next time the user signs in.

- **Tech Achievement 2**: I achieved 100% in all four Lighthouse tests in both my Login and Main pages.

### Login Page:
<img src="https://github.com/nadiaz2/a3-persistence/blob/main/Login_Lighthouse.png?raw=true" width="700"/>

### Main Page:
<img src="https://github.com/nadiaz2/a3-persistence/blob/main/Main_Lighthouse.png?raw=true" width="700"/>
