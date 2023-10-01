Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 25nd, by 11:59 AM.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express),
a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

Baseline Requirements
---

Your application is required to implement the following functionalities:

- a `Server`, created using Express (no alternatives will be accepted for this assignment)
- a `Results` functionality which shows all data associated with a logged in user (except passwords)
- a `Form/Entry` functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account.
- Persistent data storage in between server sessions using [mongodb](https://www.mongodb.com/cloud/atlas) (you *must* use mongodb for this assignment). You can use either the [official mongodb node.js library](https://www.npmjs.com/package/mongodb) or use the [Mongoose library](https://www.npmjs.com/package/mongoose), which enables you to define formal schemas for your database. Please be aware that the course staff cannot provide in-depth support for use of Mongoose.
- Use of a [CSS framework or template](https://github.com/troxler/awesome-css-frameworks).
This should do the bulk of your styling/CSS for you and be appropriate to your application.
For example, don't use [NES.css](https://nostalgic-css.github.io/NES.css/) (which is awesome!) unless you're creating a game or some type of retro 80s site.

Your application is required to demonstrate the use of the following concepts:

HTML:
- HTML input tags and form fields of various flavors (`<textarea>`, `<input>`, checkboxes, radio buttons etc.)
- HTML that can display all data *for a particular authenticated user*. Note that this is different from the last assignnment, which required the display of all data in memory on the server.

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

Deliverables
---

Do the following to complete this assignment:

1. Implement your project with the above requirements. I'd begin by converting your A2 assignment. First, change the server to use express. Then, modify the server to use mongodb instead of storing data locally. Last but not least, implement user accounts and login. User accounts and login is often the hardest part of this assignment, so budget your time accordingly.
2. If you developed your project locally, deploy your project to Glitch (unless completing the alternative server technical acheivement described below), and fill in the appropriate fields in your package.json file.
3. Test your project to make sure that when someone goes to your main page on Glitch (or an alternative server), it displays correctly.
4. Ensure that your project has the proper naming scheme `a3-yourfirstname-yourlastname` so we can find it.
5. Fork this repository and modify the README to the specifications below.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a3-firstname-lastname`.

Acheivements
---

Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the
assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%.
These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README,
why it was challenging, and how many points you think the achievement should be worth.
ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

*Technical*
- (10 points) Implement OAuth authentication, perhaps with a library like [passport.js](http://www.passportjs.org/).
*You must either use Github authenticaion or provide a username/password to access a dummy account*.
Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment.
Please contact the course staff if you have any questions about this. THIS IS THE HARDEST ACHEIVEMENT OFFERED IN WEBWARE. You have been warned!
- (5 points) Instead of Glitch, host your site on a different service like [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com). Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse?
- (5 points) Get 100% (not 98%, not 99%, but 100%) in all four lighthouse tests required for this assignment.

*Design/UX*
- (10 points) Make your site accessible using the [resources and hints available from the W3C](https://www.w3.org/WAI/), Implement/follow twelve tips from their [tips for writing](https://www.w3.org/WAI/tips/writing/), [tips for designing](https://www.w3.org/WAI/tips/designing/), and [tips for development](https://www.w3.org/WAI/tips/developing/). *Note that all twelve must require active work on your part*.
For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively
getting it "for free" without having to actively change anything about your site.
Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard.
List each tip that you followed and describe what you did to follow it in your site.
- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings.
Which element received the most emphasis (contrast) on each page?
How did you use proximity to organize the visual information on your page?
What design elements (colors, fonts, layouts, etc.) did you use repeatedly throughout your site?
How did you use alignment to organize information and/or increase contrast for particular elements.
Write a paragraph of at least 125 words *for each of four principles* (four paragraphs, 500 words in total).

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Your Web Application Title

your glitch (or alternative server) link e.g.

Professor Roberts gave me an extension on this assignment.
  So I was given an extension on this assignment but I ended up being sick a little longer than I anticapted and it took me longer to finish this because of that. So sorry for the extended delay!

This is a basic grocery list maker. It keeps track of pricing per item and total price. You can reset the whole list and modify items in the list. It uses the CSS Flex/Flexbox for positioning certain elements on the page. To modify an item's price, enter a price in the price field, check the checkbox to the right of the item (or items, can modify multiple items at the same time), then click the Modify Item Price button. All items checked off will have their price in the list updated. I should note that its only the list itself that'll get the price updated. If you update the price of an item in the cart it won't reflect because it was added to the cart before the price change.

For the CSS framework I used Watercss. It's a very simple framework that took care of almost everything I needed for CSS. The only modifications I made were list styling (to remove bullets from an unordered list), positioning, and one specific text segment color.

For middleware used, I used express.json, express-session, a custom function for redirecting back to login when not authenticated.
Express.json parses the request body into json format making it easier simpler to handle server side.
Express-session keeps track of login sessions and adds the appropriate information to requests and responses.
I also use passportjs and passport-github to handle the oauth authentication. Passport serves as middleware to handle the oauth information for express and works with express-session to ensure the right information is maintained.
The one I wrote simply redirects if the request session is invalid.

I chose oauth with github for my authentication because of the challenge it imposed. This did cause me to take longer than I expected to but I couldn't be happier with what I learned from doing it. The biggest challenges I faced were oauth and lighthouse analysis adjustments.

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please
add a little more detail about what it does.

## Technical Achievements
- **Tech Achievement 1**: Oauth via github! This was a pain but I got this running and I couldn't be prouder!

### Design/Evaluation Achievements
- **Design Achievement 1**: 100 on all 4 Lighthouse categories! When I tested this locally I was able to obtain 100 on all 4 categories of the lighthouse analysis and I provided a screenshot in the assets directory.
