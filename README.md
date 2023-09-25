## Task Tracker 2.0

https://a3-david-gobran-nrubm.ondigitalocean.app

- the goal of the app is to have a task tracker with persistent storage and user accounts
- the hardest things for me were figuring out environment variables and how to use Mongo
- I used local storage as my authentication strategy because it was the simplest. Assuming the user inputs a correct password (or creates a new user by logging in for 1st time), the local storage sets an attribute for User that is then used to get the appropriate data from Mongo
- I used Water.css because I wanted something that worked out of the box with no configuration
  - I kept my existing CSS from A2 which centered everything and made the table look better
Notes:
- only supports deleting and modifying one task at a time
- you can modify a task by checking the box next to it and clicking the 'Create/modify task' button

## Technical Achievements
- **Tech Achievement 1**: I hosted on Digital Ocean. I think it's better than Glitch because it uses a version of Node that works with Mongo, so I didn't have to specify my Node version in Package.json
- **Tech Achievement 2**: I got 100% on each required Lighthouse test
