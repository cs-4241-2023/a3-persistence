# Statistics Tracker for Counter-Strike: Global Offensive
Author: Thomas Pianka

Glitch link: https://a2-thomaspianka.glitch.me/

This project is intended to be used as a statistics tracker for the game Counter-Strike: Global Offensive. The user can input their statistics from each match, and the app will store that information, while also calculating the K/D ratio based on the inputted statistics and displaying that to the user, alongside the other statistics they inputted. I used the CSS flexbox positioning technique, primarily using a column `flex-direction` so the elements of my page line up vertically. There are no specific instructions to use the application through Glitch. However, if installing the project files locally, be sure to have Node.js installed on your machine. The project has one dependency, so to install it prior to running locally, run `npm install` within the project directory inside of a terminal or command prompt. To run the application locally, run `node server.improved.js` within the same terminal or command prompt, then navigate to `localhost:3000` within a web browser. The external CSS file uses element selectors, ID selectors, and class selectors, and the primary font the application uses is Poppins, which is a font I found on Google Fonts.

## Technical Achievements
- **Tech Achievement 1**: My project is contained within a single page, with the form input on the same page as the table. When the table is shown and the user inputs a value, both the server data and the table update immediately, and the new value that was inputted is shown. Since my server data only consists of the values in the table, the current state of the server-side data is always shown when the table isn't hidden.
- **Tech Achievement 2**: For each row in the table, the user is able to modify the values in the table using the modify button found in the corresponding row. The only value they are not able to modify is the K/D, since it is a derived field and is calculated from the values the user is allowed to input or modify.

## Design/Evaluation Achievements
- **Design Achievement 1**: Think-aloud user test #1
  1. Olson
  2. The user indicated that it would be nice for the page to have more instructions on how to operate its various features, and that including a short description of the purpose of the application would also be a nice feature.
  3. The user said that they were initially confused and surprised about the default server data that is shown when the app begins running, as they thought it was erroneous or that it was old data from someone else.
  4. I would take their suggestions and add more instructions on how to use the various inputs and buttons on the page and add a short description of the purpose of the project. I would also either indicate that the server data that is already present is meant to be there, or I would remove said server data entirely.
- **Design Achievement 2**: Think-aloud user test #2
  1. Gobran
  2. The user indicated it would be nice for the modify and delete buttons to not be on the same side of the table, and instead have one button on the left end and the other button on the right end. They also indicated that the table headers for the columns with buttons were not really necessary.
  3. The user indicated that the input fields were quite close together and almost seemed cramped, which was surprising as did not occur to me, since the user was testing the application on a smaller display than the one I used to work on it.
  4. I would take the user's suggestions and move the two buttons in each row of the table such that one button is on the left side of the table and the other button is on the right side of the table. I would also space apart the input fields in the form more, so that it doesn't feel cramped on smaller displays.

## Resources Used
- https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing
- https://www.w3schools.com/html/html_tables.asp
- https://www.geeksforgeeks.org/how-to-override-the-css-properties-of-a-class-using-another-css-class/
- https://developer.mozilla.org/en-US/docs/Learn/Forms
- https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
- https://stackoverflow.com/questions/7271490/delete-all-rows-in-an-html-table
- https://linuxhint.com/find-index-of-objects-javascript-array/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag