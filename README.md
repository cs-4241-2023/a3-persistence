## Tier List Generator

Your glitch (or alternative server) link e.g. https://a3-michael-oliveira.glitch.me/

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- the goal of the application
This application allows users to create tier lists to rank different items. Users enter images that represent their items and a rating out of 100, and the site automatically gives each item a letter grade. Data persists on the server using a mongo backend, and is tied to a specific user account.

- challenges you faced in realizing the application
Github's OAuth tutorials use Ruby, so I had to translate the examples into NodeJS. I had to figure out how to do HTTP requests on Node, as that was not possible out of the box like it is for browser JS.

- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
I chose to use Github OAuth authentication. The server code is only marginally more complicated with OAuth than a username/password system (as the access code granted still needs to be used in an API call to fetch meaningful data for that user), but the frontend code is significantly easier, only requiring a link button to the authentication site. Since it was worth more points to do it this way, I decided to do it.

- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
I used water.css because it looked nice in the demo and when applied to my site. I added additional CSS to center justify some elements and to round the border of the github icon.

- the Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please add a little more detail about what it does.
`cookie-session` is used to make setting cookies significantly easier by abstracting away the logic of setting cookies into simply modifying the values in an object (`request.session`).
`express.static('public')` is used to make express auto-serve the static files, which are sent as-is and require no extra logic to send.
`express.json()` is used to automatically convert the `body` of `POST` requests from stringified JSON to JS objects.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy. Users confirm ownership of a GitHub account using OAuth, and the application uses their GitHub user id to identify them when storing data.
- **Tech Achievement 2**: I achieved a 100% in all four lighthouse tests required for this assignment.

### Design/Evaluation Achievements
- N/A