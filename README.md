## a3-SmeeBoi

your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me

Modified a2 "game" to use Express, MongoDB, GitHub OAuth Authentication (with Passport.js), and CSS with Bootstrp. I also used EJS to render different views instead of sending different html files in server code. 

5 main views
1) Welcome - user can sign in with GitHub
2) Edit Player - form to create Player account in database
3) Menu - choose to play game or edit player
4) Game - play game
5) Results - see current player stats and top 10 player stats

- Goal: meet requirements
- Challenges: routes with OAuth
- Authentication: I chose GitHub OAuth because it seemed straightforward (or so I thought)
- CSS: I used Bootstrap for CSS because it seemed like most popular option
- Express middleware: I used 2 middlewares. One to check database connection and one to see if user is authenticated. 


## Technical Achievements
- **Tech Achievement 1**: OAuth authentication with GitHub using Passport.js

- **Tech Achievement 2**: Heroku hosted site instead of Glitch

