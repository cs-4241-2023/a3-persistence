Glitch Page: https://glitch.com/~a2-ammarrinan

# Overview
This page is a UI for adding to and deleting from a database of users with various feilds.
It lets you connect and make GET, POST, and DELETE http requests directly through the UI.
On the left side there are inputs to create a new user with their name, email, user type, and department. 
A list of all the users the server is saving is stored on the right side, which allows you to delete individaul users as well as all the users at once.
The derived feild is the email slot on the table, taking the first letter of their first name and their last name followed by the id of the user, so that every user will have a unique email

# Technical Achievments:
(5 points) Create a single-page app that both provides a form for users to submit data and always shows the current state of the server-side data. To put it another way, when the user submits data, the server should respond sending back the updated data (including the derived field calculated on the server) and the client should then update its data display.

# Design Achievments:
(5 points per person, with a max of 10 points) Test your user interface with other students in the class. Define a specific task for them to complete (ideally something short that takes <10 minutes), and then use the think-aloud protocol to obtain feedback on your design (talk-aloud is also fine). Important considerations when designing your study:

## Students I evaluated with:
- Ryan Rabbitt: 
  - Problems: Found that the fields did not have any error checking for empty strings
  - Comments: Aesthetics are very nice, the colors are nice to look at
- Tate Donnelly
  - Problem: didnt initiall understand what field was derived (the email), and also didnt think there was any text error checking
  - Comments: Site is very straightforward, and add error checking and make sure that you can't get duplicate emails from people with the same name

## What would I change: 
- Add more error checking/parsing: empty names, make sure names have capital first letters, etc.
- Add a method to make sure emails are unique, so if theres multiple amarrinan's, add a number to the end to make them unique

