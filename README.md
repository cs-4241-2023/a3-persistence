
---

## Meeting Time
https://eminent-flint-option.glitch.me/

The web applicaiton is used at the moment to record meetings so that they won't be forgotten. It also includes a password so that not anyone can just spam the application with any meetings that they want to make.

The form consists of:
Meeting Name: The name of the meeting
Location: The location of the meeting
Date: The date of the meeting (MM/DD/YY)

The final input is the password field, **THE PASSWORD IS "Paul Godinez"**

Upon pressing submit, it will update the website with a list of all future meetings and how many days it will be until that meeting takes place.
The amount of days until the meeting takes place is the "derived field" that is the new row of data, which takes the current date and subtracts the date of the meeting to get how many days it is until the meeting takes place.

HTML:
The HTML form is the four fields which is used to collect the data so that it can be sent to the server
The resutls page is the same page that you start on, it only appears upon clicking submit

CSS:
The CSS was changed so that the background was grey and the text was red, the colors of WPI.
Element Selectors: There are numerous element selectors in the css to change the form and the entries inside the form
ID Selector: The password field is bolded so that people know that it is seperate to the form above which is used to plan meetings
Class selector: The flexbox class is used so that the entire body of the file can be put into a flexbox

CSS Positioning:
As mentioned earlier, the flexbox was used so that the form and the results field can be alligned, and if page is too small, then the results will wrap beneath the form. 
The roboto font was added (since it's my favorite) and is used for all text in the website.


## Technical Achievements
- **Tech Achievement 1**: The entire website takes place on one page, where the form allows users to submit data and automatically updates the server with the new data if it's allowed to be updated. For example, if a meeting was submited with the date 11/11/2023, then as of 9/11/2023 it would show the new meeting with days until the meeting set at 60.
  
### Design/Evaluation Achievements
N/A
