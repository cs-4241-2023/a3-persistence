Colin Fyock - https://a3-colin-fyock.glitch.me/

Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## Your Web Application Title

Your glitch (or alternative server) 
https://a3-colin-fyock.glitch.me/

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
The goal of my application was to create a server side version of my project 2, which was a todo list that allowed the user to input something todo,
the time the item was added and the priority of the item. This would then be added to a mongoose database. This database is then displayed whenever
the user adds, removes, or modifys any item on the database. The database contains a row for each todo list item, the date added, the priority,
the due by date (which is made from adding 7 times the priority to the date added) and the user id of who added the item for user tracking.
- challenges you faced in realizing the application
I had many challenges, one of which was not understanding how exactly node worked, and when I went to run my website locally I would run
npm run start and nothing would happen. I thought I had messed up my code before even starting a3, but I learned that the server was running
on localhost 3000, but just didnt say that so I had no idea. Another challenge was working with a div that hid the website until the user 
logged in. I had not worked with much divs or javascript that changed the html in the website so it was somewhat hard to wrap my head around.
A challenge I ran into at the very end was that I had an if with no else in my server.post("/register") located in my server.improved.js file
and it would consistently give me an error when registering a user and then logging in with that user. The error only occured when I would log
in after, so I spent so long inspecting the log in code only to find that it was the missing else which, because it was missing, would call
response.send() twice and result in an "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client" error. I spent forever
online looking for stack exchange or code examples on what was wrong with my code, I found people discussing how good/bad the errors were in node
before finding the answer. I wish I had kept it but the answer was in a stack exchange comment with like 0 points of some guy saying that he 
missed an else and once he put it in it fixed everything. It seems like a dumb comment but it did save my code after an hour and half of looking around.

- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
I chose a simple username and password authentication using a unique user id per person in the mongo db database. I have 2 schemas in the db,
one for the items in the todo list and one for the users of the todo list. Each item that is added is stamped with the user id so I can retrieve
all the items for specific users or so they can edit the various items. The username and password is nothing special, it simply checks the db
if the username and password match, it removes the div covering the page. If they dont match it does nothing. In the backend the post
request response either sends a true, false, or error. true is if the username and password match, false if either are wrong, and error
if something went wrong. It can error if the password exists but the user doesnt as I check username first, but the web app continues and does not crash.


- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
I used the bootstrap framework as I have heard of it and have seen some nice creations in the various classes I have taken. I kept the custom css
I utilized and made from a2 as it fit the website theme better. I do borrow some of the aspecets from bootstrap like the sizing of the h1, b1, and tables
are different than before. I think they look better now that they are more standardized with the bootstrap framework. The background color and the 
echo on the title are the biggest parts that were kept from my a2 assignment.
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.
I used the middleware packages of express.json, express.static, and mongoose db. Express.json allows me to parse json from post requests,
this allows me to call request.body without having to parse it like from a2. mongoose db allowed me to create my two schemas for the database. 
These schemas are todo_list, which stores the todo list items, and user_list which stores the logins for users. Express.static allows me to run
static files in express.

## Technical Achievements
- **Tech Achievement 1**: Get 100% in all four lighthouse tests:
https://cdn.glitch.global/27ecaa25-6fa0-4ea2-967d-1b728de89cfd/a170871c-1b44-4b33-a109-fb40b297e0f4.image.png?v=1695619896864
I did it, it required some tweaking specifically in the form labels that I lacked. The link is posted above for the screemshot of all the achievements.
