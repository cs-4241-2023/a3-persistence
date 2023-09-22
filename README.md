## Music Listening Builder

Matthew McAlarney

Link to Glitch Project: https://a3-maccode7110.glitch.me/ 

Music Listening Builder is an improved version of my a2 web application named Music Listening Tracker. Music Listening Builder allows a user to create an account, login, and perform CRUD operations on an individualized music listening list associated with their account. Through the CRUD operations, a user can submit new music to be added to their music listening list (creation), submit existing music to be deleted from their music listening list (deletion), and submit a modification for existing music in their music listening list (Update). Every user who creates an account on Music Listening Builder is assigned their own music listening list, which ensures that individuals only view the music that they add, delete, and modify. 

Application goal: To allow users to build their own music listening list through creation, modification, and deletion operations.

Challenges I faced during development: The largest challenge I faced was figuring out the best way to structure the data stored on the server and in a given MongoDB collection document. My answer to this challenge was integral to the functionality of this application, which was to store data in the form of an object containing a username, password, and array of music items for each user. Along the way, figuring out the best way to query data from my MongoDB database, setting up the Express server properly to recognize varying file directories, and implementing cookie sessions presented smaller challenges that I was able to resolve.

Authentication strategy: I chose to use a basic in-app authentication strategy consisting of just a username and password. A successful login occurs only when the user's entered password matches the password saved in their corresponding database document. As this was my first time implementing a user authentication strategy, I followed a simple in-app approach as I wanted to first learn and practice the logic of authenticating a user through the server, which connects to the database.

CSS framework: I used the Bulma CSS framework to style this application for a few reasons. I have prior experience using this framework, the documentation for the different capabilities of the framework is excellent, the framework provides good support for mobile responsiveness, the CSS classes offered for all HTML elements are beautifully designed and aesthetically accessible, and these classes are easy to include in any HTML document. Furthermore, Bulma CSS classes nicely append to each other when assigning class attributes for each HTML element.

Express middleware packages I used:
  1. app.use(express.static(directory path)): Serves all GET requests for the directory path and fully qualifies paths for all files in the directory path.

  2. app.use(express.json()): Body-parser middleware that parses JSON for all incoming requests that only activates if data sent to the server is passed with a Content-Type header of application/json/

  3. app.use(express.urlencoded({extended: true})): Retrieves data for the server sent by default form actions such as POST requests, or GET requests.

  4. app.engine('handlebars',
  hbs({ //hbs configuration for app.engine
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views/html/layouts/"
  })
  ): Sets up the engine for the app server so that handlebars can be used to render text and information from the server to the HTML pages.

  5. app.use(cookie({
  name: 'session', //the name of the cookie to set
  keys: ['key1', 'key2', 'key3', 'key4'] 
  })): Setup the app to use cookies, which involves creating a cookie session, and declaring keys to encrypt information sent to the server. This allows the web application to remember information about a user visit.

Below is a detailed outline of the functionality of Music Listening Builder:

Here are some sample user accounts that have already been created and can be used to test the application:

Username | Password

joe      | pw
luke     | pw
matt     | qq
james    | qwq

Music Listening Builder Page (the application homepage):

In order to access the main functionality of the application (Build Music Listening List page), a user must login with a username and password using the Login form. If a new user does not already have an account for Music Listening Builder, then the user must first create a new account with a username and password using the Create New Account form.

Form Validation for Create New Account:

If the submitted username or password contains at least one field consisting of only white space (an empty field), a message will appear below the form informing the user that at least one input field is missing information.
If the submitted username or password contains whitespaces within the entered text, a message will appear below the form informing the user that the submitted username and password could not be sent to the server and that the username and password cannot contain whitespaces.
If the submitted username matches any usernames stored in the database collection, then a message will appear below the form informing the user that an account could not be created for them as the entered username has already been taken by an existing user.

Form Validation for Login:

If the submitted username or password contains at least one field consisting of only white space (an empty field), a message will appear below the form informing the user that at least one input field is missing information.
If the submitted username or password contains whitespaces within the entered text, a message will appear below the form informing the user that the submitted username and password could not be sent to the server and that the username and password cannot contain whitespaces.
If the submitted username matches a username saved in the database collection but the entered password is incorrect (does not match the saved password associated with the account) then a message will appear below the form informing the user that the entered password is incorrect.
If the submitted username does not match a username saved in the database collection then a message will appear below the form informing the user that their account could not be found.


Build Music Listening List Page:

The Build Music Listening List page can be accessed through the top navigation bar on the application after successfully logging in. The Build Music Listening List page has a button labeled "Get Music Listening List". Press the Get Music Listening List button to display the full list of music saved for the user who is currently logged in. It is highly recommended to check the music listening list before submitting music for addition to the list, deletion from the list, or modification to the list.

Submit New Music form:

Use the Submit New Music form on the Build Music Listening List page to enter a band name, the name of one of their albums, and the year the album was released. The Submit New Music form is used to add new music to the current user's list.
When the submitted music saves in server memory and in the database document for the logged-in user, a message will appear below the Submit New Music form indicating that the submitted music has indeed been saved for the current user. The age of the album (derived field) will also appear in an additional message.

Form validation:

If the submitted music contains at least one field consisting of only white space (an empty field), a message will appear below the form informing the user that the submitted music could not be sent to the server and that at least one field is missing information.
If the submitted music contains an invalid album release year (a negative number), a message will appear below the form telling the user that the submitted music could not be sent to the server and that the album release year is invalid.
If the submitted music contains an album release year that has not occurred yet (ex. a year in the future such as 2024 or 2025), a message will appear below the form telling the user that the submitted music could not be sent to the server since the input album has not been released yet.

Delete Existing Music form:

Use the Delete Existing Music form on the Build Music Listening List page to enter a band name, the name of one of their albums, and the year the album was released. The Delete Existing Music form is used to delete music already shown in the current user's list.
When the submitted music has been sent to the server, a message will appear below the Delete Existing Music form indicating that the submitted music has indeed been sent to the server for comparison against existing music (this comparison attempts to find a match between the submission and a data entry in the current user's list. If there is a match, then the data entry is deleted from server memory and the current user's database document and is no longer shown in the full list of music). A user should then click the Get Music Listening List button to see if the submitted music has been deleted. Keep in mind, if the submitted music was not shown in the logged-in user's full list of music before completing the submission, then the submitted music could not have been deleted.

Form Validation:

If the submitted music contains at least one field consisting of only white space (an empty field), a message will appear below the form informing the user that the submitted music could not be sent to the server and that at least one field is missing information.
If the submitted music contains an invalid album release year (a negative number), a message will appear below the form telling the user that the submitted music could not be sent to the server and that the album release year is invalid.
If the submitted music contains an album release year that has not occurred yet (ex. a year in the future such as 2024 or 2025), a message will appear below the form telling the user that the submitted music could not be sent to the server since the input album has not been released yet.

Modify Existing Music form:

Use the Modify Existing Music form on the Build Music Listening List page to enter a list ID number, band name, the name of one of their albums, and the year the album was released. The ID number entered into the first field for this form needs to match an ID number shown in the current user's music listening list accessed through the Get Music Listening List button. If the entered ID number does not match an ID number shown in the music listening list, then no modification to the current user's music listening list will occur.
You can choose to update any number of the three fields (band name, album name, release year) with new data. Be sure to enter data for all three of these fields. After submitting the Modify Existing Music form, click the Get Music Listening List button to refresh and view the new list of music data for the current logged-in user. This updated list for the current logged-in user will include the modification for the list item with the ID you specified in the form.

Form Validation:

If the submitted music contains at least one field consisting of only white space (an empty field), a message will appear below the form informing the user that the submitted music could not be sent to the server and that at least one field is missing information.
If the submitted music contains an invalid album release year (a negative number), a message will appear below the form telling the user that the submitted music could not be sent to the server and that the album release year is invalid.
If the submitted music contains an album release year that has not occurred yet (ex. a year in the future such as 2024 or 2025), a message will appear below the form telling the user that the submitted music could not be sent to the server since the input album has not been released yet.

Note:

Please note! The Login, Create New Account, Submit New Music, Delete Existing Music, and Modify Existing Music forms are case-sensitive and are also senstive to the amount of entered whitespace. When deleting and modifying music for the current logged-in user's music listening list, be sure to enter the existing music with the correct casing and whitespace amount!


## Technical Achievements
- **Used bcrypt library to hash user passwords on the server and then saved those hashed passwords to the database (5 Points)**: I used the Node.js bcrypt library to hash (encrypt) user passwords on the server when a user creates a new account. This hashing process involves two steps in my Express post middleware for creating new user accounts. The first step is to use the bcrypt library to generate a salt through the genSalt() function. The second step is to call the bcrypt hash function to hash the new user password using the generated salt. The hashed password is then stored in a MongoDB database document created for the new user. Server-side password encryption via hashing ensures that a web application is protected from server attacks aimed to identify usernames and passwords. Website security for sensitive information such as passwords is critical, which is why I think this technical achievement is worth 5 points.

### Design/Evaluation Achievements
- No design achievements addressed in this assignment
