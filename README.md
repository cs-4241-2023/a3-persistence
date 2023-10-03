A3-KSMANGONE
---

https://glitch.com/edit/#!/a3-ksmangone

## Run Training Index

This is a website made to index runs for a training program you follow. Simple tracking website. CSS Grid was used to create the 3 input boxes (and titles) to appear in a 3 across position instead of 3 top down in one column.
To use the application simply input a Distance traveled in miles, Time taken in minutes (use decimals to indicate seconds -- secs/60) and an optional description of the run, if it was a workout or not this may be important or part of a 
multi part run. Finally, an output will appear on the table with the information inputted, as well as a calculated average pace of the run. Finally, there are 2 buttons in which the user can edit or delete a row. Clicking the edit button
will return 3 prompts in which you can adjust either of the 3 original inputs. The delete button (on first attempt takes 2 clicks) instantly deletes the run from the table.

For authentication there is a simple database collection storing username and passwords. It is simple to register for an account, simply type a username that isnt already in use, and a corresponding password then hit register. You must be logged in 
to a specific account to see that account's run entries. This was simple for me to implement, and the main reason I did it this way.

I used the MVP css, simply due to time constraints and being unable to learn a more in depth framework like bootstrap. I made some small adjustments including centering, adjusting the width of the entry table to match the rest of the form. Button colors to increase contrast (and outline), as well as input bar lengths.

Middleware:

app.use(express.json()) & BodyParser: Important middleware to reading and parsing the data sent through the body section of a request.

app.use(express.static("public")) : used for express to serve the static files within the public directory i.e. index.html

Cookie-session: Create cookies stored in the user browser to contain their username once logged in. This is then used for retrieving data & overall verifcation of logged in user.

## Technical Achievements
- **Tech Achievement 1**: I achieved a 100% in all four lighthouse tests required for this assignment.

https://cdn.glitch.global/57c886ed-d2ac-472e-b97b-50bca4611ec7/3c7ba04e-a856-46f4-b8a8-076d6c64bfb7.image.png?v=1695487318263

Achieved using suggestions from the lighthouse analysis.


## Design Achievements
- **Design Achievement 1**: W3C Design Principles

1.Provide meaning for non-standard interactive elements 

  - For the input elements and the table on my index page I labeled the elements using ARIA and placed a role for each as well. 

2.Reflect the reading order in the code order 

  - All of the elements in my index.html and login.html are laid out as they would be in the page. Though some elements are side by side, and there is no real way of showing this through code without making it look atrocious. 

3.Help users avoid and correct mistakes 

  - My index page has labeled units that they should input. Highlighted inputs that are required. And when an error occurs on an input in the index page or the login page there is a response that tells the user what went wrong accordingly. 

4.Identify page language and language changes 

  - Both of my HTML documents have the HTML tag at the top, with the language specified to be “en” or english. 

5.Associate a label with every form control 

  - All form inputs have an appropriate label such as username and password. 

6.Provide sufficient contrast between foreground and background 

  - I specifically chose the dark blue color for the layout as it was directly contrasting of the white background. This allows the elements to stick out better. 

7.Provide clear and consistent navigation options 

  - Buttons & overall color layout is consistent with navigation & user change. Login & register buttons are the same color blue as the index run button. All of these elements in this blue color are important to the user for submission & navigation of the page, navigation headers are the same location & format to keep this consistent as well. 

8.Ensure that form elements include clearly associated labels 

  - All form elements have a label and are close enough in proximity to the each other that it is clear to the user what each label represents. 

9.Provide easily identifiable feedback 

  - A prompt appears when there was an error with logins, data submission, and even prompts when changing the data on an input to ensure that the user understands what they are doing, and any errors that may occur. 

10.Provide clear instructions 

  - All labels have units, and requirements for the inputs. Required fields are colored red, and have an asterisk. Buttons for submission are clear with buttons such as login, register, and index run (submit data). 

11.Use headings and spacing to group related content 

  - There is clear spacing to group elements. The login buttons being next to each other (these are similar elements) with some slight spacing from the input fields in which the password & username field are close together as these are related fields too. Spacing is used to separate the table in the index.html from the submission form as well. 

12.Use headings to convey meaning and structure 

  - The login page has a clear label of login/register to label the page correctly for the user to understand this is a login page. 

 



