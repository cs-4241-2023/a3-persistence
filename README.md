Thea Caplan
Link: https://hammerhead-app-rjt7q.ondigitalocean.app
(NOTE: SA mentioned having the link be not in a3-first-last format was okay.)

Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: ~~September 22nd, by 11:59 AM.~~ Given an extension by the professor.

## College Schedule Maker

Link: link e.g. https://hammerhead-app-rjt7q.ondigitalocean.app 

The goal of this application is to create a visual schedule holding inforamation about the user's college course schedule. The user can add, modify, and delete their classes as desired. Each user has their own account. 

The biggest challenge I faced in creating this application was formatting JSONs and get requests to specific routes properly. Especially the GitHub authentication, as it took a long time to figure out how to send requests to a 3rd party service. It was also hard to figure out how to get the values I wanted from MongoDB using the custom schema I was following. I also made a lot of typos I took hours to find :(

I chose 2 authentication strategies. First I implemented logging in using a username and password. This was the simplest way I could see implementing peresonal accounts. I then implemented GitHub OAuth, mainly because it seemed like a fun challenge that would help me understand the functionality of JavaScript, JSONs, GET/POST requests, MongoDB, and cookies better, which with the hours I spent implementing it it certainly did help my understanding.

I picked the sanatize.css framework, mainly because I wanted a very simplistic UI. I didn't want to draw away from the functionality of the site as it already has a lot of elements on it for the purposes of functionality (adding, deleting, modifying, and viewing data).

The five Express middleware packages I used were:
1. cookie-session: I used this to store who was logged in in a given session. I could map errors and usernames to a single user.
2. dotenv: dotenv allowed me to use environment variables and hide the sensitive information needed to connect to the database as well as host on Digital Ocean
3. axios: I used this to enable GitHub OAuth. It helped me send requests in the proper format to GitHub and deal with the callbacks, as well as get the username of the user once successfully authenticated.
4. cors: This was used to help maintain the individual values for users when sharing the site with others.
5. mongodb: this was used to connect to the database. Middleware was created for express such that if the database connection did not exist the site would redirect to an error page.

Acheivements
---

## Technical Achievements
- **Tech Achievement 1**: Implemented GitHub OAuth authentication.
- **Tech Achievement 2**: Hosting site on Digital Ocean. By hosting on Digital Ocean my site will always be active as long as I pay for the service, rather than on glitch were the site will deactivate if not used. It was hard to upload files to Digital Ocean which slowed development, and database and port connections needed to be reformatted to work properly. I also have to pay for this service and any domains I want associated which is a downside. (was told by SA I didn't need to change the url to a3-thea-caplan so I didn't have to buy the domain)
- **Tech Achievement 3**: Got 100% in all four lighthouse tests required for this assignment on desktop. Screenshot on the GitHub.

### Design/Evaluation Achievements
- **Design Achievement 1**: How I implemented the CRAP principles:

The element that received the most emphasis on the main page of the site was the schedule display. It is the only part of the website that has color and is not limited to a singular column of the layout like the forms are. This is intentional to draw the user’s eyes to the all information they have inputted into the site. Every other row of the table alternates in shade to make the information in the table easier to digest and to make it clear that the information within each column changes as you move down the rows. The element with the most emphasis on the login screen are the buttons as they are not black text on white background as the rest of the screen is, but black text on light grey. This is intentional as it makes the user clearly see what they need to press to get complete the log in process.

I used proximity to organize the visual information on my site by putting each of the 3 input functionalities (adding, deleting, and modifying) within their own column on the site. I put the data output display below the inputs on its own row to highlight its different functionality. Within each input form, similar fields were organized next to each other so their relationship to each other was clear. On the login screen, logging in using a username and password and logging in using GitHub authentication were given their own rows, but were still kept within the same column to show they have the same functionality despite the differences in input.

The design elements I used throughout my site was the white background, black colored  courier font, and the thin black line borders around the forms. Originally, the background was a dark grey with white font on top, however to increase the contrast of the website and increase accessibility the colors were inversed. The font type was kept the same everywhere helping keep the site uniform, using size and boldness to differentiate labels. The thin black line wrapped around any container, keeping the pattern of whatever is wrapped within the thin black line is related: each input form as well as information display for the schedule and the delete class feature.

I used alignment to organize information by putting the forms in line with each other in the first row of the website. This makes it clear were all information needs to be inputted. The schedule is placed below the forms such that the user can tell it is a different feature as it does not follow the 3-column layout of the forms but is centered on the page instead. Related fields within forms are kept next to each other, showing their relation and keeping them inline with each other.  The titles of the forms are all aligned horizontally with each other as well to show their similarities while highlighting each one’s different features. On the login screen, the 2 forms of login are kept in line vertically with each other to show that they are not interlinked with each other but have the same overall functionality of logging the user in.

Baseline Requirements
---

Your application is required to implement the following functionalities:

- a `Server`, created using Express
- a `Results` functionality 
- a `Form/Entry` add, modify, and delete data items in user account
- Persistent data storage in between server sessions using [mongodb]
- Use of a [CSS framework or template]

- HTML input tags and form fields of various flavors
- HTML that can display all data *for a particular authenticated user*. 
- Achieves at least 90% on the `Performance`, `Best Practices`, `Accessibility`, and `SEO` tests

