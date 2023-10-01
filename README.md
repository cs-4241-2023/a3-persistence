
## BMI Calculator

Glitch link : a3-aarsh-zadaphiya.glitch.me

Username: username
Password: password

Include a very brief summary of your project here. Images are encouraged, along with concise, high-level text. Be sure to include:

Summary:
BMI Calculator is a web application designed to assist users in monitoring their BMI (Body Mass Index). It takes the user's height,weight, age and gender to calculate their body mass index. It keeps a track of the user's BMI everytime and summerises by date when they add their new measurements. The main challenges transitioning to Express, and using MongoDB to store the database.


- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)

CSS Framework:
I have used Bootstrap CSS. Bootstrap is a popular and widely used front-end framework that provides a set of pre-designed CSS and JavaScript components for building responsive and visually appealing web applications. I have used it to style and structure the webpage, incorporating elements such as form controls, buttons, typography, spacing, and an alert component for a cohesive and responsive design. I made some modifications to bootstrap elements (eg, changed button text to be bold and use font that is consoistant with rest of the app).

Middleware Packages:

express: I used the Express.js framework to set up my web server and define routes.

body-parser: Although I didn't explicitly mention it in my code, I implicitly used the body-parser middleware for parsing JSON and URL-encoded request bodies.

MongoDB and MongoClient: While they're not middleware in the traditional sense, I utilized the MongoDB database and the MongoClient library to interact with my database.

These middleware packages helped me handle HTTP requests, parse request data, and connect to the database, making it easier to develop my web application with Node.js and Express.js.


## Technical Achievements
- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy

I receaved a 100% in all four lighthouse tests required for this assignment (Image attached). Initially the accesibility score was 89%, therefore I changed the background and foreground colour, and had to add the id to the input tags so it associates with the correct label. And the initial SEO score was 78%, therefore I looked at all the recomendations lighthouse provides , and added the meta name="viewport" tag. Not really a challenge, however to meet some requierments to acheave 100%, I had to change some colour schemes that did not match with my personal prefferance and idiation for the app.

(10 points) Implement OAuth authentication, perhaps with a library like passport.js. You must either use Github authenticaion or provide a username/password to access a dummy account. Course staff cannot be expected, for example, to have a personal Facebook, Google, or Twitter account to use when grading this assignment. Please contact the course staff if you have any questions about this. THIS IS THE HARDEST ACHEIVEMENT OFFERED IN WEBWARE. You have been warned!
(5 points) Instead of Glitch, host your site on a different service like Heroku or Digital Ocean. Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse?


### Design/Evaluation Achievements
- **Design Achievement 1**: 

(10 points) Make your site accessible using the resources and hints available from the W3C, Implement/follow twelve tips from their tips for writing, tips for designing, and tips for development. Note that all twelve must require active work on your part. For example, even though your page will most likely not have a captcha, you don't get this as one of your twelve tips to follow because you're effectively getting it "for free" without having to actively change anything about your site. Contact the course staff if you have any questions about what qualifies and doesn't qualify in this regard. List each tip that you followed and describe what you did to follow it in your site.

My site is accessible by following these tips from the W3C site:

Semantic HTML: I used semantic elements like headings and labels to create a meaningful document structure, aiding both browsers and screen readers in understanding content.

Alt Text for Images: I added descriptive "alt" attributes to images, ensuring that users relying on screen readers receive meaningful image descriptions.

Accessible Forms: I included clear labels for form fields, making it easy for users to understand the purpose of each input.

Error Handling: I provided clear instructions and placeholder text in forms to help users avoid and correct mistakes during input.

Color Contrast: I selected contrasting colors for better readability, benefiting users with visual impairments.

Headings and Structure: I used heading tags to organize content hierarchically, enhancing navigation and comprehension.

Semantic Structure: My pages have meaningful structures with appropriate container elements, ensuring content associations are clear.

Focus Styles: I applied focus styles to interactive elements for keyboard navigation and highlighted focus states.

Meaningful Link Text: I used descriptive link text to convey the purpose of each link clearly.

Language Attributes: I specified the content language with the "lang" attribute for correct text interpretation.

Clear Content: I used simple language and formatting, benefiting users with cognitive disabilities.

Keyboard Navigation: Users can navigate through form fields and interactive elements using the "Tab" key, improving keyboard accessibility.


My site applies the CRAP principles as follows:

Contrast - I applied contrasting colors to enhance visual contrast, such as using #5585b5 for the heading background and #f5f8fa for text color in the <h1> element, making the heading stand out.

Repetition - I try to maintain  consstancy through the use of the "Dosis" font family, ensuring a unified and professional appearance across the site.Repetition is evident in the consisten t use of background colors like #d8f6fa and #e0f4f6 for various boxes, promoting a cohesive and visually pleasing design.

Alignment - Alignment is crucial for a clean layout, and I've aligned elements both horizontally and vertically to create an organized appearance.
Text alignment is strategically used to enhance readability and usability. Elements are centered horizontally using "margin: 0 auto;", contributing to proper alignment.

Proximity - I made sure that the procimity between labels and form elements for user comprehension, aiding the association between labels and inputs.
Logical groupings and proximity are also maintained in the layout of form elements within the login box and BMI calculator form, making it easier for users to understand and interact with the content.



