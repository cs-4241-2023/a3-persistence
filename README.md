Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

## Personalized Todo List

Hosted by glitch: [Link to Glitch](https://a3-persistence-arnav-sacheti.glitch.me/) \
Username: `webware` \
Password: `password`

The primary objective my application is to provide users with an intuitive interface to add, update, and track their daily tasks, ensuring productivity and task management become seamless. A challange that I faced was integrating the MongoDB database with my Express backend, ensuring data consistency and real-time updates. Additionally, implementing user authentication securely while maintaining a smooth user experience was a hurdle I overcame. I chose to use Express sessions for authentication primarily because it provided a straightforward way to manage user sessions and seemed the easiest to implement, given the application's requirements. I utilized the Materialize CSS framework for its modern design components and responsiveness. To better align with our branding, I made custom modifications, including changing primary color schemes and tweaking card designs for better readability. Lastly I used a few differnt express middlewares:
* Server side logging
* Static page fetching
* MongoDB connection monitoring
* Session cookies
* urlencoding
* JSON body parsing


## Technical Achievements
- **100% Lighthouse Report**: Accomplished 100% in all of the lighhouse categories on both the login and main page, i have included a JSON copy of the lighthouse report in the github if it helps
- **Added Password Encryption for Storage**[5pts]: I do not believe that adding support for password encryption was required, but this is a better stance for password security. This deserves some EC since it does require a little bit of troubleshooting your workflow as there are now nested callbacks which caused issues requiring me to use `.then` to ensure concurrency.
