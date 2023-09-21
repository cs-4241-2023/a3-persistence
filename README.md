Bright Lin
https://a2-bright183.glitch.me/

## Your Web Application Title

My application is a leaderboard for any type of game that involves kills, deaths, and assists. The user will enter their name, kills, deaths, and assists. The server will calculate the KDA based on the data given and then store all the data on the server. The client side will then display all the data in a table. The CSS of my web app includes element selectors to change the look of the background, title, and table. I then used the ID selector to change the padding and used flexbox layout for the information inside the form tag. I also used the flexbox layout for the whole body element. The class selector was then used to with "values" which is the class for all the different columns in the table shown. I then used a black ops one font from google fonts.



## Technical Achievements
- **Tech Achievement 1**: 
I created a single-page app that has a submit function to send data to the server and save the data and also update the table in the same page. I then have the delete button that sends a request to the server that deletes the data from the server's data storage and also delte it from the table in the display.

I also created a modify data option. There are modify buttons for every row, if you select a new form will open up with new input sections. There will then be a save modify button that modifies the data in teh server side and also on the table. There is also a cancel button that gets rid of the modify form. 


### Design/Evaluation Achievements
- **Design Achievement 1**: 

Tasks:
1. Create a new row of data.
2. Modify that data to have the KDA be greater than before.
3. Delete all the data in the table.



Name: Diaz

What problems did the user have with your design?
There was a bug were you can still see the modify form after deleting all items in the table and you cannot modify anything so it returns an error.

What comments did they make that surprised you?
He mentioned that the order of Kills, Deaths, Assist, and KDA was weird and did not felt right. He said that having the good things grouped together is better. I checked too and most KDA borads have Assists after Kills. I just felt it was right at the time to put Assists after Deaths.

What would you change about the interface based on their feedback?
I would need to fix the bug with the modify form still being there after everything is deleted. I want to hide the form if the row you are modifying has been deleted. i also want to make it so that you have to have all fields filled in whenever you try to modify or sybmit, since that was something he mentioned too.