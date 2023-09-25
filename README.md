Bright Lin
https://a3-bright-lin-2e9e58c1e3a9.herokuapp.com/

## Your Web Application Title

- The goal of the application is to be used to keep score of whatever game you want where it includes your kills, deaths, assists, and a newly calculated KDA.

- Challenges I faced when was trying to figure out how to 

- I chose to have a object that has both the username and password saved in mongodb. It was just a seperate collection to my main data. This data can then be looked up when users try to login. I then used this data and created a couple of example login accounts. Each login account will have unique and different data that you could add to or modify. 
Accounts:
1. Username: bright Password: hi
2. Username: fish   Password: hello
3. Username: cats   Password: bye
I chose this way to do authentication because it was the first way i thought of doing it and it did seem like the simpliest way to implement it.

- I chose to use the Blaze UI CSS framework because it looked very clean and had very well documentation so I could make my application the way I wanted to look very easily using the documentation. I did not do any custum CSS.

- Express Middleware
1. cookie-session: Used to establish a cookie based session for my login
2. express.urlencoded({ extended:true }): Used to get data sent by defaut form actions and GET requests
3. express.static('public'): Serves up static files in the directory public

## Technical Achievements
- **Tech Achievement**: 

1. I've achieved 100% on all lighthouse report fields on both the login page and the main page.
2. Uploaded project on Heroku: It was very simple to just create a new app in Heroku and then you can easily connect a repo to Heroku and run the website. 


