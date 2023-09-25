
---

## Meeting Time
https://eminent-flint-option.glitch.me/

The web applicaiton is used at the moment to record meetings so that they won't be forgotten. There is a login along with password to ensure not just anyone can add meetings to the website.

The Website first contains a login button with a username and password field. At the moment, this is the only thing on the website that can be interacted with since everything else is disabled
Upon entering the correct username and password, the login form will gray out and everything else will be ungrayed, meaning they can be interacted with.
On top of ungraying the new fields, since the user is now verified, all of the data will show up by showing the meetings in a bulleted list below the form.

**The Username and Password is "PaulGodinez"**

The form consists of:
Meeting Name: The name of the meeting
Location: The location of the meeting
Date: The date of the meeting (MM/DD/YY)
Delete Button: used for deleting entries
Update Button: Used for Updating entries
Add Button: Used for adding entries.

To update or delete an entry, the meeting name must first match the entry that you want to delete or update, and upon clicking the button, the data showed in the list below will reflect the change.
I.E To update or delete an entry called MQP Meeting, I must have the "Meeting Name" field match exactly MQP Meeting, and then once I click delete it will delete, or once I click update it will change the field
to whatever I have written in the form at the time.

For adding an entry, all you need to do is change the three fields and press add.

Challenges: The biggest challenge when it came to programing the website was ensuring that all the parts from A2 was nicely adapted into A3, as moving the DB from local to mongo was quite annoying.

Authentication: The authentication strategy I chose was comparing the entry that the user tried to login with to a collection in the database that stored all the users that are allowed to use the website. I chose this since it was the easiest to do.

HTML:
The HTML form is the four fields which is used to collect the data so that it can be sent to the server
The resutls page is the same page that you start on, it only appears upon clicking submit

CSS:
The CSS framework I used was Bootstrap, mostly because it was the only one that I thought looked nice with my website when testing out different frameworks. The changes I have made to the framework are the same CSS
changes I used in A2.


## Technical Achievements
N/A
### Design/Evaluation Achievements
N/A
