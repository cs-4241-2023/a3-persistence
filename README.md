Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 22nd, by 11:59 AM.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express), 
a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

Baseline Requirements
---

Your application is required to implement the following functionalities:

- a `Server`, created using Express (no alternatives will be accepted for this assignment)
- a `Results` functionality which shows all data associated with a logged in user (except passwords)
- a `Form/Entry` functionality which allows users to add, modify, and delete data items (must be all three!) associated with their user name / account. 
- Persistent data storage in between server sessions using [mongodb](https://www.mongodb.com/cloud/atlas) (you *must* use mongodb for this assignment).
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

your glitch (or alternative server) link e.g. http://a3-charlie-roberts.glitch.me

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:


- the goal of the application
The goal of my application was to create a functioning web application that could serve as a place to keep track of one's favorite artists. It allows users to create and log in to accounts, as well as add, update, and delete artist data from the site. The basic user account can be logged into with username "Admin" and password "pass123"
- challenges you faced in realizing the application
Some challenges I faced while making this application were keeping the data consistent across the html page, JS server, and the database, as well as implementing user accounts, as I had implemented the functionality using URL query strings before class on Monday, and had to use cookies instead. 
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
I chose to authenticate users using a username and password, and storing those values in cookies for the browser, because I had previously been sending account information through the site url, and changing the code to have it set and use the data from the cookie was not difficult from where I had been.
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored
I chose the CSS framework Tacit, as when opening the page to display the styles, the first line was, "Tacit is a CSS framework for dummies, who want their web services to look attractive but have almost zero skills in graphic design". This perfectly describes my skills in graphic design, and it seemed like a relatively simple framework that would not change the layout which my site previously had.
Aside from specific styles for certain elements with Ids and classes, the only modifications which I made to the framework were to the <main> and <input> elements on the index.html page. The <main> element already had a handful of styles on it from assignment 2 to make it look good, including a flex box, and I like the way it looks so I did not want to change it. I also added in some additional styles to the <main> element to set the background to be an image and color that would not be too conflicting with the page but still be interesting
- the five Express middleware packages you used and a short (one sentence) summary of what each one does. If you use a custom function for *one* (and one alone) middleware please 
add a little more detail about what it does.
TODO

## Technical Achievements
- **Lighthouse 100%**: Both my login.html and index.html pages reach 100% for performance, accessibility, best practices, and SEO

### Design/Evaluation Achievements
- **12 Tips For Site Accessibility**: 
1. *Help users avoid and correct mistakes* - I achieved this using the "errorzone" and "errortext" text elements in both my login and main page. These elements will fill themselves in with useful information when user actions are taken, such as prompting the user to fill in all fields if they have pressed the submit button without doing so, or alerting them that an artist they are trying to delete is not in the database.
2. *Use headings to convey meaning and structure* - On the main "index.html" page, I use three headings to convey the meaning of the three different main sections of the website. "Delete Artist" is the heading of, and aligned with the form used to remove artists from the database, "Ranking Leaderboard" heads and aligns with the list of artists in that account's databse in order based on the ranking, and "Favorite Artist" heads the section detailing information about the artist with the highest ranking in the database for that account.
3. *Provide clear instructions* - I provide the user with instructions regarding all actions that they can take. All of the "input" elements have corresponding placeholder attributes that outline the information that should be input into each field, as well as some text above the field detailing the action that will be taken on form submission, such as "Type the name of an artist in the database to delete" or "Submit artists to the database here!"
4. *Provide sufficient contrast between foreground and background* - I made the background for my application a grey-white striped image, which is relatively lightly colored. As such, all of the text on the webpage is black, as well as the color of the background of the <main> section headers so as to differentiate the text that is relevant to the user from the background image.
5. *Keep content clear and concise* - All of the text elements on my main and login pages are relatively short and to the point so as to not crowd the screen with text. The text explaining the purpose of the website and how to navigate the site are not more than one line, keeping reading to a minimum. Also, I colored the text of the "Delete Artist" header red to further denote that that section is for deletion, in comparison to the other section headers which are green and yellow respectively.
6. *Provide easily identifiable feedback* - When an action is taken as a user on my website, there is always some visual change that corresponds to the status of the action taken. May it be adding a <li> element to the list of accounts on the login page when a new account is created, or alerting the user in the #errorzone span that the artist which they entered to delete from the databse does not exist.
7. *Use headings and spacing to group related content* - On my login.html page, I use different headings and spacing to separately group the two forms on the page, in addition to images, so that the user knows what each form does, and does not get confused on which fields belong to which form.
8. *Include alternative text for images* - Both of the images(of the key and account profile icon) that appear on my login.html page that accurately describe them, and would allow a user to understand what each image is, and the meaning it is conveying even if the images did not load.
9. *Reflect the reading order in the code order* - When creating my login.html page, I wanted the user to read this page top to bottom, as the part of the site that the user will most likely navigate to first will be the login fields at the top to log into their account, and as they scan down the page, they can see where they can create new users, what users are already created, and useful information from the #errortext <p> element
10. *Identify page language and language changes* - I define the language in the html tag in both of my html pages, and never use text from another language, so a change to this is never needed
11. *Provide informative, unique page titles* - On both index.html and login.html, I have used the <title> tag to set the title of each page in the browser, as well as setting an <h1> tag at the beginning of each file to display each page's descriptive title in the web page.
12. *Ensure that form elements include clearly associated labels* - Every <input> element in both of my html pages has a "label". The way I decided to implement these labels were in the form of input placeholders. I found that they do not take up any more space on the window, and there is no way to mistake the labels, because the placeholders are inside the input for which that information will go

- **Adherence to CRAP principles**:
1. *Contrast*: Within the main page of my web application, I utilized the principle of contrast mainly in the <main> section of the page. My goal with the page was to have users eyes immedietly drawn to the portion of the page which displays information about artist in the database for the current account, and how to edit that information. To do this, I headed each distinct section of <main> with a colored header on a black background. The black background itself provides much contrast to the elements on the rest of the page, of which most have a white or light grey background. The color of the text in each header provides good contrast as well, as those three headers are the only text in this application that is not colored either black of grey, making them stand out. On the login.html page, I provided some contrast using images on the page. Although there are only two images, they provide good shape contrast to everything else on the site, as all other non-text elements are in the shape of rectangles.
2. *Repetition*: One of the most prominent elements which I used multiple times in this application is the white/grey background image. it appears as the background for both the login page and the main page everywhere except the submit form on the main page, as I wanted to provide contrast and let the user know that that portion of the page is the form to sumbit artists. Another element of the page that I used repetition on was the color scheme. I decided not to make my page very flashy and have a relatively consistent black/white color gradient for most of my page. This can be seen in the fact that almost every element in both pages is black, white, or grey. A design element which I decided to repeat in this project was the page heading for both the login page and the main page. On both pages, the title is the only element at the top of the screen with a black border, and gives the combination of both pages a more consistent feel.
3. *Alignment*: One of the ways in which I used alignment in this project was in the grouping together of the three sections of the main page below the submit form. I created a class for all of these headers so that they would all be aligned and be able to be identified as headers of distinct sections, but with separate purposes. I also made use of the principle of alignment in the placement of text within <input> elements. I confirmed that the placeholder text inside of each input box was aligned to the left. This provides the value that when users input text into the field, the text they type will start in the same place as the placeholder text within the <input> field, and appear more consistent.
4. *Proximity*: In my login page, I used proximity of elements to relate them in multiple examples. In addition to creating a heading for each form to describe its purpose, I also added images above the headers, so that the images will be associated with the header, and each form looked at as separate sections of the page. I also placed the list containing the accounts currently on the database directly beneath the form to create a new account, so that when a user creates a new account, they can see the visual change happening on the screen right next to where they had just inputted that information. On the main page, I used proximity to relate the information shown in the <main> element, primarily the "Ranking Leaderboard" and "Favorite Artist" sections. These sections of the page are some of the main attractions for the page, and the information in the Favorite Artist section is dependant on the information in the Ranking Leaderboard section, so when changes are made to the information for that account, both sections are updated simultaneously, and their proximity makes it easy to correlate one with the other for the user.



