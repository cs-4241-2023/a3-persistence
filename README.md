Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===
## ToDo

URL: https://personalmanager-f9ebf3c35885.herokuapp.com/

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

- The goal of the app is for the user to have a very easy way to plan their day with a to-do list with different priority levels.
- I have faced the challenge of time and unfortunately was not able to get the authentication to give the user's data once logged in. I have the authentication code working and getting the user data (commented below server code) but not fetching the user-specific data.
- I went for the github2 authentication with passport.js but I did not have enough time to do anything with the user data.
- I used the sanitize.css CSS reset. Professor Roberts allowed me to just use a CSS reset for the framework requirement since I really liked the custom CSS I created.
- Express Middleware:
-   Body-parser Middleware: Used to parse incoming JSON data in the request body.
-   Custom Request Logging Middleware called requestLog: This logs information from requests.
-   Error Handling Middleware called errorHandler: Catches and handles errors then sends an error message
-   Static File Middleware: Uses middleware to serve static CSS and JavaScript for my site.

## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy. The user can log in but they don't receive their own data but general data. (The code is in the server.js file but is commented out below the actual running server file)
- **Tech Achievement 2**: I used Heroku to host my site. I really enjoyed using this service as it was very plug-and-play with GitHub and it automatically gets the main branch of my repo and runs it. Glitch is required to import the project and have a separate instance while Heroku just uses the current GitHub main version.
- **Tech Achievement 3**: In my personal testing, I got a lighthouse score of 100 in all categories.
![Screenshot 2023-09-24 012150](https://github.com/MarekSGarbaczonek/a3-mareksgarbaczonek/assets/66498850/676eacc2-a0a9-4e2f-aad4-d8bcf07cb85e)

### Design/Evaluation Achievements
- **Design Achievement 1**: CRAP Principles:
Which element received the most emphasis (contrast) on each page?
- In my design, the element that receives the most emphasis through contrast is the task list. By using a dark gray color for the task list against a white background, I created a high level of visual contrast that makes the task list stand out from the rest of the UI. This choice is effective in drawing the user's attention to the most crucial part of the app, which is managing tasks. Additionally, I've used color contrast in the priority buttons, making it easy for users to distinguish between priorities, with green representing lower priority and red indicating high priority. These contrasting colors help users quickly grasp the significance of each task.
 
How did you use proximity to organize the visual information on your page?
- I used proximity to group all of the tasks together in the right panel, and each task contains its relevant information, creating a clear association between the task and its details. This proximity makes it easy for users to identify the task and understand its attributes at a glance. Furthermore, I've grouped the priority buttons closely with each task, indicating the priority level of each task. The pop-up hints over the priority buttons provide additional context without cluttering the interface.

- What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site?
-   I went with a nice white and gray color design and used color very conservatively to only show the priority of each cell which gives a lot of visual contrast and emphasis when just glancing at the site. I have pop-up hints over the priority buttons but visually it is clear that green means don't worry and red means emergency which further helped sell my design. I have used a very simple non curvy font called Nunito Sans which gave the page a modern feel as the text is very readable and very minimalistic.

- How did you use alignment to organize information and/or increase contrast for particular elements.
-   The page is split into two sections where the left is the menu (clearly contrasted with its color from the right panel) and the right is the main app that the user interfaces with. I decided to align the relevant information vertically on the right panel; you start by looking at the top with the current date and you move your gaze down to the tasks that are due and then further down to the field of adding more tasks. I have aligned the create task to the bottom to give visual separation from the tasks and also made the color of the input different to further separate it. The colors in the priority visuall;y contrast the tasks they are associated with and in the input as well. I made it so that the user almost immediately can identify which tasks they should do based on visual priority.
