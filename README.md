glitch: http://a3-rbdyer.glitch.me

My project is a webpage that allows you to calculate player ratings for basketball players. The player attributes are inside shooting, outside shooting, athleticism, playmaking, defense (each on a scale from 0-99). These attributes are used to calclate the players overall rating.

You can use "username" and "password" in order to log into the application and view some dummy data.

Some challenges I faced when realizing the application:

- The login feature of the app gave me a few complications. I tried using mongoose to create user models but was having some difficulties with that. I ended up storing the username and password as JSON and using bcript to encript the password.
- I also didn't get around to fixing the error when a new user is added. I beleive that this is because the user is still in the process of getting added to the database as the server checks the password within the server. Since the password isn't there it throws an error since the user didn't load in time. If you reload the page you can log in with the new username and password.
- Another issue I encountered was sending the user to the app after successfully logging in. After asking the TA's some questions I learned that I needed to add a form to my html in order to correctly submit the post request. Without the form my server wouldn't load the new page correctly.

The authentication strategy I chose involved using bcrypt. I chose this method because it seemed like the easiest to implement.

I used Bootstrap as my CSS framework. I chose bootsrap because of its popularity.
