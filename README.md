Colin Fyock https://a2-cfyock.glitch.me/

## Technical Achievements

- **Create a single-page app that both provides a form for users to submit data and always shows the current state of the server-side data.**: 
I used the .map function in javascript to dynamically create the table rows whenever something is deletedor added to the database. 
This is then pushed to the table through the id that the table has, id="todo_table". 
The page updates without the user having to refresh the page.

## Design/UX Achievements

- **Test your user interface with other students**:

1. Provide the last name of each student you conduct the evaluation with: Dufault
2. What problems did the user have with your design? 
They were distracted by the shadows on the headers, they wanted more of a separation between the forms and the actual list of todo items. 
They had a problem with being able to submit todo items with empty fields, and said the page was a little bland.
3. What comments did they make that surprised you?
It surprised me that they found the shadows in the headers distracting as that was my favorite part of my website.
The comment on separation also surprised me, as I thought that <br> tag would have been enough to separate the delete something field and the Your Current Todo List field.
4. What would you change about the interface based on their feedback?
I would probably change the code to not allow the user to input blank fields into the todo list,
a todo entry with nothing as the item and a blank spot as the priority does not make sense.
I would add another divider line under the delete something from the todo list to further separate the two categories.
I would potentially try swapping out the horizontal dividers for vertial dividers, like a tri-fold website.
I think this would solve some problems that Will brought up about the website and may make the website less bland.

## Your Web Application Title

-**The Easy Todo List:** This website uses a todo list as a frontend to send information to a backend server that stores the information.

- Basic Requirements:
- The Server in my application is located in the server.improved.js file. 
It handles the two post requests, one being /submit which is whenever a user adds an item to the todo list.
The other request is /delete or when the user deletes something from the todo list.
The file also handles the derived field, which is created through taking the created date and adding on 7 days for every tier of priority. 
If the priority is 1, then it adds 7 days to the created time in order to create a deadline for the todo item.
This file also handles deletes, if the user deletes a todo item, I use the js filter function on the array that stores the todo items (appdata).
This filters the array to remove all items that share the name of the item we are removing.
I originally used a for loop and splice(), but it had came up with weird errors where it would remove two at a time from the list.
This was most likely because it would remove one item from the list and truncate the list but the for loop would continue to index forward creating an error.
- A results functionality that shows the whole dataset. The dataset is stored in the array appdata within the server.improved.js file. 
It is then read to the page using the javascript map function that shows the whole array as a table with rows at the bottom of the page.
This table updates automatically when something is added or removed, more information located in the technical achievements category.
- A Form/Entry functionality: The forms I use are located within the index.html file and I use four forms.
They include date forms, text forms, and number forms. The date is for the insertion of a creation date for the todo list, the number is the priority form, and the text is the text of the item that needs doing.
A second text form is used for the delete form that takes in the name of the item that should be deleted.
- A Server Logic: The server logic was previously explained in the server category, but it contains the routine for addition and deletion of items in the todo list, along with creating the derived field.
- The Derived Field: Also mentioned in the first server category: The derived field is the combination of priority and the creation date to create a deadline that scales with the importance of priority. 
The lower the priority (the higher the number) the further away the deadline becomes.

**HTML**
- Forms: The HTML forms I use are two text forms for the name of a todo list item, one number form for priority and one date form to make the creation date of a todo list item. All located in the index.html file
- Results: A results page located at the bottom of the main page titled Your Current Todo List
- Validate: The page does validate
- The app does not contain multiple pages
**CSS**
- CSS Styling of Primary Elements: The titles, body, and table are all styling to make them different from the default.
The background has a custom parchment color. The font is custom in different text fields, this includes three different fonts.
- CSS Selectors: A element selector is used for h1, body, table, and more. An ID selector (#fancy_text) is used to change the font of the title to Josefin Sans.
A class selector (.todo_add) is used to change the text within the input tag to the font Exo.
- CSS Positioning: I used a flex within the body tag and turned it into a column, as that is how the website is arranged. 
I used multiple fonts and left no text as the default font.
- CSS is all located and ordered in the main.css file
**JavaScript**
- Get and Fetch are located in the main.js and server.improved.js files and I used array manipulation and simple arithmatic to create a derived field within the server.improved.js file.
**Node.js**
- The server.improved.js acts as my HTTP server and creates a dervied field out of the created time date along with the priority field to create a deadline field.

