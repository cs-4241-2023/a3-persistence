Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
Due: September 25nd, by 11:59 AM.
===


Tristan Sharich

Glitch Site: https://classy-veiled-legend.glitch.me

Notes: 
I made a simple game where two people enter in a number to try and guess what number
the computer is "thinking" of.

In my project the server recives a number from each player of the game, 0-10, 
and a random number, 0-10, that is generated in main.js. 
The server takes this data and evaluates if a player guessed the same number that was 
randomly generated. It returns true or false, depending on if a player won, back to the front end.
It also sends all the orginal front end data back to it.

I used the felbox formatting to make a table like structure. I tried to make custom cells for some 
of the categories to help make things look better. The result didn't look as nice as I hoped but 
the flexbox structure is there. 

The delete function removes a guess the user has made. The modify function lets the user change one of the losses to a win, despite their guess. Both of these go from the first matching instance of in the data to the latest. All the buttons, input fields, texts field and custom table for the leaderboard are controlled by bootstrap. 

Also to run on Glitch, keep line 102 on server.improved.js commented out. To run it locally it needs to be uncommented. 
