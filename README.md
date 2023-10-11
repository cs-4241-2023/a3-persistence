## I was given an extension on this assignment by Professor Roberts

## Request for Extension

http://a3-sophia-silkaitis.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of my application was to have a user sign in to view a form to request an extension, and only be able to see their form submissions.
- I had a lot of challenges in this application. Most of them included my backend and issues with mongodb, as well as troubles inputting buttons and ensuring the functionality of my site.
- the authentication strategy I chose was just to have the user input their username and password in the database when they create an account, and then have the database check if the username was in the database, and if so what the password associated with it was. i chose this method since it seemed the easiest and most intuitive for me to implement.
- I used bootstrap as when I looked it up it was one of the most popular css frameworks and i thought it would be valuable to learn. I did not put in any custom css.
- Middleware packages:
  1. app.use (login)- checks if the user is logged in during the session and if not redirects back to the log in page.
  2. app.post(login) - authenticates the user and connects to database as they try to sign in to see if their user/pass match the database. if the user account does not exist, adds an account in the database and logs them in
  3. submit - adds the user entry to the database and returns all entries associated with the logged in user
  4. delete - removes the selected entry from the database and returns all entries associated with the logged in user
  5. modify - modifies the selected entry in the database and returns all entries associated with the logged in user.
     the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for _one_ (and one alone) middleware please
     add a little more detail about what it does.

## Technical Achievements

- **Tech Achievement 1**: I got 100% in all lighthouse tests for each page.
  Screenshot 2023-09-30 at 11.32.31 AM
  Screenshot 2023-09-30 at 11.34.30 AM

### Design/Evaluation Achievements

TWELVE INITIATIVES I INPUTTED:

Tips for Writing:

1. Provided informative, unique page titles
   - "Log-In Page", "Extension Form"
2. Use headings to convey meaning and structur
   - used headings for login to convey explanation for log-in and provide more info
3. Provide clear instructions
   - used help text for email for input requirements

Tips for Design: 
1. Provide sufficient contrast
  - input dark button outline instead of former light grey that blended into background for both buttons 
2. Don't use color alone to convey information
  -added asterisk + red color for required fields in form 
3. Ensure that form elements include clearly associated labels
  - every form input has a clear associated label 
4. Ensure that interactive elements are easy to identify
 - made the submit buttons a different background color from input areas to clearly distinguish between the two. chose black as the background color for buttons to make it clear that it was submit

Tips for Accessibility: 
1. associate a label with every form control
  - similar to #6, every form control element has a label 
2. Help users avoid and correct mistakes
  - input help text for date to avoid confusion about negative/past due assignments 
3. Identify page language
  - includes html lang= en on each page 
4. Use markup to convey meaning and structure
  - uses aside tage for login screen to properly structure the message about creating a new account
5. Reflect the reading order in the code
  - the submit buttons are at the bottom to properly show the order. the "sort by priority button" is also only shown when submitted and therefore only in the render function, as well as shows up at the beginning of the code to show that that button is shown before all other code.
