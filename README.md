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
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy. The user can log in but they don't receive their own data but general data.
- **Tech Achievement 2**: I used Heroku to host my site. I really enjoyed using this service as it was very plug-and-play with GitHub and it automatically gets the main branch of my repo and runs it. Glitch is required to import the project and have a separate instance while Heroku just uses the current GitHub main version.
- **Tech Achievement 3**: In my personal testing, I got a lighthouse score of 100 in all categories.
![Screenshot 2023-09-24 012150](https://github.com/MarekSGarbaczonek/a3-mareksgarbaczonek/assets/66498850/676eacc2-a0a9-4e2f-aad4-d8bcf07cb85e)

### Design/Evaluation Achievements
- **Design Achievement 1**: CRAP Principles:
-   Which element received the most emphasis (contrast) on each page?
-     The task list received the most emphasis and contrast as it is dark gray on top of a white background so it visually stands out from the rest of the UI. I wanted the user to look at the task list first as that is the most important part of the app.
-   How did you use proximity to organize the visual information on your page?
-     I used proximity to group all of the tasks together as well as all of the relevant task information is on each task which is nicely grouped on the right side of each task. Since the task information is on the task itself, it visually has very clear proximity and association with the parent row task element.
-   What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site?
-     I went with a nice white and gray color design and used color very consevratively to only show the priority of each cell whcih gives a lot of visual contrast and emphasis when just glancing at the site. I have pop up hints over the priority buttons but visually it is clear that green means dont worry and red means emergency which further helped sell my design. I have used a very simple non curvy font called Nunito Sans which gave the page a modern feel as the text is very readable and very minimalistic.
-   How did you use alignment to organize information and/or increase contrast for particular elements.
-     

- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings. 
Which element received the most emphasis (contrast) on each page? 
How did you use proximity to organize the visual information on your page? 
What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site? 
How did you use alignment to organize information and/or increase contrast for particular elements. 
Write a paragraph of at least 125 words *for each of four principles* (four paragraphs, 500 words in total). 
