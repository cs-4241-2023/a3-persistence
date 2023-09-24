## Season Playlist Application

Isabella Pabon - https://a3-isabellapabon.glitch.me/

Account:


Username: Test


Password: 123



Test has two songs, one in winter and one in summer.

(But try making an account its funnnn :D)

My application is a app that allows users to create accouts/log in and displays all the songs
they have in each playlists when the season is changed.

The hardest part of this assignment for me was how to display the information that was specific to
each user, instead of just showing all the information in my database. I used req.session.username to
get the user after they log in, and gave that value to my submit/load/remove/edit requests.

The authentication strategy I used was just to have the user create an account and store that data in my database.
When a user logs in, my app checks to see if their username and password are in the database, and if they're not,
it says login failed. I chose this strategy because it seemed the easist/intuitive way to implement it.

For my css framework, I used the water.css light framework, because it also was the easist to implement and I enjoyed
its simplicity.

The express middleware packages I used were cookie-session, handlebars, and static.

I used cookie-session to hold my user password and username to pass that information to my post requests
and only send back the info for each specific user. I used handlebars to implement log in and redirect the user
to the different pages I have. (index, create, and main.) I used static for my static html and css files.

## Technical Achievements

- **Tech Achievement 1**: I got 100% in all four lighthouse tests required for this assignment.  
  https://cdn.glitch.global/c36eb247-8231-4492-9dd9-882b7b0da5c4/100 proof?v=1695579221677
