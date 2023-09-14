# Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

Due: September 22nd, by 11:59 AM.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express),
a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

## Baseline Requirements

Your application is required to implement the following functionalities:

- a `Server`, created using Express (no alternatives will be accepted for this assignment)
- a `Results` functionality which shows all data associated with a logged in user (except passwords)
- a `Form/Entry` functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account.
- Persistent data storage in between server sessions using [mongodb](https://www.mongodb.com/cloud/atlas) (you _must_ use mongodb for this assignment).
- Use of a [CSS framework or template](https://github.com/troxler/awesome-css-frameworks).
  This should do the bulk of your styling/CSS for you and be appropriate to your application.
  For example, don't use [NES.css](https://nostalgic-css.github.io/NES.css/) (which is awesome!) unless you're creating a game or some type of retro 80s site.

Your application is required to demonstrate the use of the following concepts:

HTML:

- HTML input tags and form fields of various flavors (`<textarea>`, `<input>`, checkboxes, radio buttons etc.)
- HTML that can display all data _for a particular authenticated user_. Note that this is different from the last assignnment, which required the display of all data in memory on the server.

Note that it might make sense to have two pages for this assignment, one that handles login / authentication, and one that contains the rest of your application.
For example, when visiting the home page for the assignment, users could be presented with a login form. After submitting the login form, if the login is
successful, they are taken to the main application. If they fail, they are sent back to the login to try again. For this assignment, it is acceptable to simply create
new user accounts upon login if none exist, however, you must alert your users to this fact.

CSS:

- CSS styling should primarily be provided by your chosen template/framework.
  Oftentimes a great deal of care has been put into designing CSS templates;
  don't override their stylesheets unless you are extremely confident in your graphic design capabilities.
  The idea is to use CSS templates that give you a professional looking design aesthetic without requiring you to be a graphic designer yourself.

JavaScript:

- At minimum, a small amount of front-end JavaScript to get / fetch data from the server.
  See the [previous assignment](https://github.com/cs-4241-23/shortstack) for reference.

Node.js:

- A server using Express and a persistent database (mongodb).

General:

- Your site should achieve at least 90% on the `Performance`, `Best Practices`, `Accessibility`, and `SEO` tests
  using Google [Lighthouse](https://developers.google.com/web/tools/lighthouse) (don't worry about the PWA test, and don't worry about scores for mobile devices).
  Test early and often so that fixing problems doesn't lead to suffering at the end of the assignment.

## Deliverables

Do the following to complete this assignment:

1. Implement your project with the above requirements. I'd begin by converting your A2 assignment. First, change the server to use express. Then, modify the server to use mongodb instead of storing data locally. Last but not least, implement user accounts and login. User accounts and login is often the hardest part of this assignment, so budget your time accordingly.
2. If you developed your project locally, deploy your project to Glitch (unless completing the alternative server technical acheivement described below), and fill in the appropriate fields in your package.json file.
3. Test your project to make sure that when someone goes to your main page on Glitch (or an alternative server), it displays correctly.
4. Ensure that your project has the proper naming scheme `a3-yourfirstname-yourlastname` so we can find it.
5. Fork this repository and modify the README to the specifications below.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a3-firstname-lastname`.

## Acheivements

Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the
assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%.
These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README,
why it was challenging, and how many points you think the achievement should be worth.
ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

_Technical_

- (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/).
  _You must either use Github authenticaion or provide a username/password to access a dummy account_.
  Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment.
  Please contact the course staff if you have any questions about this. THIS IS THE HARDEST ACHEIVEMENT OFFERED IN WEBWARE. You have been warned!
- (5 points) Instead of Glitch, host your site on a different service like [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com). Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse?
- (5 points) Get 100% (not 98%, not 99%, but 100%) in all four lighthouse tests required for this assignment.

_Design/UX_

- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). _Note that all twelve must require active work on your part_.
  For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively
  getting it "for free" without having to actively change anything about your site.
  Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard.
  List each tip that you followed and describe what you did to follow it in your site.

## Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)

# Expense Tracker

#### Live on Render: https://cs4241-assignment3.onrender.com/

![Image or screenshot of your application](/ExpenseTracker.png)

### Summary

Expense Tracker is a web application designed to assist users in monitoring their expenses. It categorizes expenditures and provides monthly summaries. The main challenges were integrating OAuth for authentication, transitioning to Express, and deploying the application to a new host.

### Authentication Strategy

I opted for OAuth authentication because it offers a secure and streamlined login process. Using OAuth also allowed for easy integration with various social media platforms, enhancing user convenience.

### CSS Framework

I chose Materialize CSS for styling the web application. Materialize CSS provides a rich set of pre-designed components, is highly customizable, and follows Google's Material Design guidelines. These features made it an ideal choice for creating a visually appealing and user-friendly interface.

### Middleware Packages

1. **express**: Fast, unopinionated, minimalist web framework for Node.js.
2. **passport**: Authentication middleware for Node.js, extremely flexible and modular.
3. **express-session**: Creates a session middleware with the given options, good for storing user data between HTTP requests.
4. **passport-local**: Local username and password authentication strategy for Passport.
5. **passport-google-oauth20**: OAuth 2.0 strategy for authenticating with Google.

---

## Technical Achievements

### Hosting on Render

I opted for Render as my hosting platform, diverging from suggested options like Heroku and Digital Ocean. The transition required me to delve into GitHub Actions to facilitate automatic deployments. Setting up GitHub Actions was challenging, as it required a keen understanding of workflows and action configurations. Additionally, I had to ensure the npm environment was set up both on my local machine and the host, aligning all dependencies and package versions.

### OAuth Authentication

Implementing OAuth was a complex yet rewarding task. The initial challenge was in handling OAuth callbacks alongside the main server logic. To resolve this, I used the Express package, which abstracted most of the intricacies related to OAuth. This allowed me to concentrate on the core application logic, making the implementation more streamlined.

### 100% Lighthouse Score

My website initially scored 96% on the Lighthouse tests. Upon investigation, I found that the site was missing meta tags for viewport settings. After adding them, the score improved to 100%. Achieving this perfect score was challenging, as it necessitated a detailed understanding of web performance metrics and how Lighthouse evaluates them.

### Switch to MongoDB

The shift to MongoDB initially posed challenges, particularly in understanding how to work with the `_id` field for data identification. However, once I grasped the concept, it simplified data manipulation significantly. The unique IDs made it easier to perform CRUD operations, making the entire development process more efficient.

---

## Design/Evaluation Achievements

### Materialize CSS

For styling, I employed Materialize CSS. This framework not only elevated the overall aesthetics but also simplified the implementation of responsive design features. It provided a range of components and utilities that enriched the user interface and experience.

### Web Accessibility Implementation

My site conscientiously implements the following twelve tips for web accessibility as outlined by the W3C Web Accessibility Initiative:

- **Associate a Label with Every Form Control**: All form controls in the application have associated labels, making it easier for screen readers to interpret the required input.

- **Identify Page Language and Language Changes**: The primary language of each page is identified using the `lang` attribute, aiding translation tools and screen readers.

- **Use Markup to Convey Meaning and Structure**: Semantic HTML tags like `<nav>` and `<aside>` are used to properly structure the content, making it more understandable for both users and screen readers.

- **Help Users Avoid and Correct Mistakes**: The site offers clear instructions and error messages, making it easier for users to complete forms and rectify errors.

- **Reflect the Reading Order in the Code Order**: The HTML markup is structured to reflect the logical reading order, improving accessibility for screen readers.

- **Write Code that Adapts to the User’s Technology**: The site uses responsive design to adapt to various screen sizes and zoom states, ensuring a consistent experience across devices.

- **Provide Meaning for Non-standard Interactive Elements**: WAI-ARIA roles and attributes are used to provide additional information on custom widgets and interactive elements.

- **Ensure All Interactive Elements are Keyboard Accessible**: All interactive elements like buttons and forms are navigable and usable via keyboard events.

- **Name, Role, Value for Custom Elements**: WAI-ARIA is used to define custom interactive elements, ensuring they are accessible and properly described for screen readers.

### Use of CRAP Principles

My site employs the CRAP principles of Contrast, Repetition, Alignment, and Proximity to enhance its design and user experience.

- **Contrast**: I used a distinct color scheme to differentiate between various elements like headers, text, and buttons. This not only captures attention but also guides the user through the site's content effectively.

- **Repetition**: I maintained a consistent style throughout the site. For instance, all buttons share a common design, reinforcing the site's visual identity and making it easier for users to interact with the application.

- **Alignment**: Elements are aligned in a manner that guides the user's eyes in a logical flow. For example, form fields and buttons are left-aligned, creating a visual line that's easy to follow.

- **Proximity**: Related elements are grouped closely together to signify their relationship. This makes it easier for users to understand the layout and find what they're looking for, such as the expense categories and their corresponding monthly summaries.

### CSS Targeting

In addition to using classes for styling, I employed CSS selectors to target specific elements precisely. For instance, the code `td:nth-child(5) .edit-button` allowed me to apply styles specifically to the edit button in the fifth column of a table. This level of granularity gave me greater control over the look and feel of individual components, without affecting other elements.
