## High Score Tracker

http://a3-jade-logan.glitch.me

The goal for this project was to allow the user to keep track of their high scores on different video games. It also includes a field for notes that a user may have, like a link for an online game or tips on achieving a higher score. 

While changing project 2 to use a database went relatively smoothly, I found it challenging to adapt it to have different users. Certain functions wouldn't work, such as the onclick functions for the edit/delete buttons, and I had trouble figuring out where things were going wrong. I ended up just using username and password pairs for authentication. I didn't think I would have time for anything more complicated, but I did use the bcrypt library to hash passwords for more security.
An account for testing:
Username: gex3
Password: N64

I used NES.css for the framework because the video game look was what I was going for. I'd actually looked at NES.css while working on the second project for ideas, so I'd had this framework in mind from the start. Since NES.css just provides the components, I did a bit of CSS for layout things like flexboxes. I also needed to override the color of the button text from white to black for better contrast for accessibility.

Middleware used:
1. static - Used to serve static files in the public and views directories.
2. json - Parses incoming JSON requests

A custom function is used to check connection.
I tried for awhile to get cookies to work, but was running out of time so I ended up not using cookie-session.
(I was going off of the rubric on Canvas and didn't realize 5 different Express middleware packages were needed)

## Technical Achievements
- **Bcrypt**: I didn't do the OAuth achievement, but I did use the bcrypt library to hash passwords before they're stored on the database. The main challenge was less with the code (bcrypt made things relatively simple) and more in figuring out what to use for hashing the passwords. I'd never used bcrypt or anything similar before, so I wanted to make sure it was a good option and that I was using it correctly. (5 points?)
- **Lighthouse**: I was able to get 100 for both pages (on Glitch the main page performance had a 99, but it was fine locally).




### Design/Evaluation Achievements
- **W3C Tips**
1. Provide clear instructions - Form inputs have placeholder text that helps indicate how to fill them in, and error messages are clear about what the issue with the form input is.
2. Associate a label with every form control - The inputs on both the login page and the main page all have labels associated with them.
3. Identify page language and language changes - The <html lang="en"> tag is used on both pages to identify the page language.
4. Help users avoid and correct mistakes - Errors with the forms on either page have different popup messages to indicate why the input was invalid.
5. Provide sufficient contrast between foreground and background - The majority of the text is black on a white backdrop, and the buttons that are not white are brightly colored and contrast with the black text.
6. Ensure that form elements include clearly associated labels - All form elements have a label directly above them.
7. Provide easily identifiable feedback - Feedback from incorrect form inputs is in an unavaidable popup, ensuring that the user will know what to correct.
8. Reflect the reading order in the code order - The ordering of the elements of the code matches the order they appear in on the page.
9. Provide meaning for non-standard interactive elements - The "Register" text in "Don't have an account? Register" is a button created using a span, so it has role = "button" (the same goes for "Login" from the register form).
10. Use mark-up to convey meaning and structure - The appropriate markup is used for headings, tables, and forms.
11. Use headings and spacing to group related content - Headings are used at the top of forms, and spacing/visual elements are used to group relevant content.
12. Don’t use color alone to convey information - Though buttons have color to differentiate them, text also makes it clear what their function is, and for the Register/Login span buttons have the same hover cursor as regular buttons to make it clear they can be clicked on.
