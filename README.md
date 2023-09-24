Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 25nd, by 11:59 AM.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express), 
a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)


## Your Web Application Title

http://a3-asosa117.glitch.me


This application uses a login page and a movie list page. You are first greeted with a login page where you must
create a user each time you want to sign in and you must login in using the user you just created. Once logged in, 
you will be in the movie list page that creates your movie list using the mongodb database and the express server.


The Goal of the application is to log a user into a shared movie list user their own account and being able to add,
delete and modify any of the items in the list. This is similiar to how the notes app allows users to share and edit 
the same note. 

Challenges I faced in realizing the application was getting the correct mongodb, and express functions working
and what exactly I need to put in them to get or post data into the database.

I chose to use an authentication strategy that signs you into a sort of "dummy" account but you still must create a user
before being able to sign in. You also must create a new user everytime you want to sign in.

I decided to use the Bulma CSS framework because it seemed clean and modern to me. I used the classes already made 
from Bulma and implemented them into my HMTL file using class. I modified the headers colors, the input box size,
the login and create buttons color and size, and the background color to white

I used express.static and express.json. static was used to access my login page and any html page when it first boots up
and json was used to send the correct data in json form so that the functions would be able to read the information recieved
without any problems.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the username/password to access dummy account but you must create
a user before you login and it must be the user you just created to login in.

- **Tech Achievement 3**: 100% on all four lighthouse test. Photo of the test is in the github.


### Design/Evaluation Achievements
- **Design Achievement 1**: I used the CRAP principles of design in my project by using contrast of color in both pages. 
I made sure to use colors that would contrast correctly against each other such as using different shades of colors that are 
light on the eyes. These colors are also not clashing with each other or extremely different which makes it pleasant on the eyes. 
The buttons and input text boxes were used to pop out against the background and make them noticeable to the user without it being the 
main focus as well. I made the headers pop out as well to allow the user to gravitate towards the color and read the main points of the
page so it makes the rest of the elements easier to understand. 

When tackling the repetition aspect of the page I made sure to use the same fonts in the respective pages to not have the user gravitate
towards an imbalance in fonts or colors from the text, buttons or input boxes. The format of the pages made sure they were the same, for
example the login page had a login and a create functionality to it that used the same header, same button, and same text box inputs.
These elements had the same appearances but were shifted downwards to make it easy to find. The colors on each page repeated for the
fonts and headers. In the movie list page all the font was green with more important text being sized bigger or smaller to differentiate
them.

Alignment was used in various ways throughout the project to make it seem as pleasing as possible. In the login page the alignment was 
focused on the left side of the screen and moved down symmetrically with each element that was added. The login portion and the create 
user portion of the first page were aligned symmetrically with each other and the elements were placed in the same places just shifted 
downward. The Movie list page of the project was centered in the middle of the page with each element being centered to avoid any 
misplacement and awkward locations. The buttons were also centered on top of each other to create a column type of alignment making it 
easier to view and click on quicker.

Proximity in both pages followed the rule that elements associated with each other should be placed close to each other.
I believe this rule was used throughout the project when it comes to button layout, input boxes and text. In the login page the
login elements were all grouped together in the top of the page and the create user elements were grouped together underneath.
The username and password boxes were also next to each other for both portions respectively. When it comes to the movie list page
the buttons to add, delete and modify were all placed on top of each other along with the input boxes used to add the movie title,
the movie length, and the movie year were all grouped together in their own box.


