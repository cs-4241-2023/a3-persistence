# BMI Calculator

**Glitch link:** [https://a3-aarsh-zadaphiya.glitch.me/](https://a3-aarsh-zadaphiya.glitch.me/)

**Username:** username  
**Password:** password

## Summary
BMI Calculator is a web application designed to assist users in monitoring their BMI (Body Mass Index). It takes the user's height, weight, age, and gender to calculate their body mass index. It keeps track of the user's BMI every time and summarizes it by date when they add their new measurements. The main challenges transitioning to Express and using MongoDB to store the database.

## CSS Framework
I have used **Bootstrap CSS**. Bootstrap is a popular and widely used front-end framework that provides a set of pre-designed CSS and JavaScript components for building responsive and visually appealing web applications. I have used it to style and structure the webpage, incorporating elements such as form controls, buttons, typography, spacing, and an alert component for a cohesive and responsive design. I made some modifications to bootstrap elements (e.g., changed button text to be bold and use font that is consistent with the rest of the app).

## Middleware Packages

- **express:** I used the Express.js framework to set up my web server and define routes.
- **body-parser:** Although I didn't explicitly mention it in my code, I implicitly used the body-parser middleware for parsing JSON and URL-encoded request bodies.
- **MongoDB and MongoClient:** While they're not middleware in the traditional sense, I utilized the MongoDB database and the MongoClient library to interact with my database. These middleware packages helped me handle HTTP requests, parse request data, and connect to the database, making it easier to develop my web application with Node.js and Express.js.

## Technical Achievements
- **Tech Achievement 1:** I received a 100% score in all four Lighthouse tests required for this assignment (Image attached). Initially, the accessibility score was 89%, therefore I changed the background and foreground color, and had to add the id to the input tags so it associates with the correct label. And the initial SEO score was 78%, therefore I looked at all the recommendations Lighthouse provides, and added the meta name="viewport" tag. Not really a challenge, however, to meet some requirements to achieve 100%, I had to change some color schemes that did not match with my personal preference and ideation for the app.

## Design/Evaluation Achievements
- **Design Achievement 1:** My site is accessible by following these tips from the W3C site:

    - **Semantic HTML:** I used semantic elements like headings and labels to create a meaningful document structure, aiding both browsers and screen readers in understanding content.
    - **Alt Text for Images:** I added descriptive "alt" attributes to images, ensuring that users relying on screen readers receive meaningful image descriptions.
    - **Accessible Forms:** I included clear labels for form fields, making it easy for users to understand the purpose of each input.
    - **Error Handling:** I provided clear instructions and placeholder text in forms to help users avoid and correct mistakes during input.
    - **Color Contrast:** I selected contrasting colors for better readability, benefiting users with visual impairments.
    - **Headings and Structure:** I used heading tags to organize content hierarchically, enhancing navigation and comprehension.
    - **Semantic Structure:** My pages have meaningful structures with appropriate container elements, ensuring content associations are clear.
    - **Focus Styles:** I applied focus styles to interactive elements for keyboard navigation and highlighted focus states.
    - **Meaningful Link Text:** I used descriptive link text to convey the purpose of each link clearly.
    - **Language Attributes:** I specified the content language with the "lang" attribute for correct text interpretation.
    - **Clear Content:** I used simple language and formatting, benefiting users with cognitive disabilities.
    - **Keyboard Navigation:** Users can navigate through form fields and interactive elements using the "Tab" key, improving keyboard accessibility.

- **Design Achievement 2:** My site applies the CRAP principles as follows:

    - **Contrast:** I applied contrasting colors to enhance visual contrast, such as using #5585b5 for the heading background and #f5f8fa for text color in the h1 element, making the heading stand out.
    - **Repetition:** I try to maintain consistency through the use of the "Dosis" font family, ensuring a unified and professional appearance across the site. Repetition is evident in the consistent use of background colors like #d8f6fa and #e0f4f6 for various boxes, promoting a cohesive and visually pleasing design.
    - **Alignment:** Alignment is crucial for a clean layout, and I've aligned elements both horizontally and vertically to create an organized appearance. Text alignment is strategically used to enhance readability and usability. Elements are centered horizontally using "margin: 0 auto;", contributing to proper alignment.
    - **Proximity:** I made sure that the proximity between labels and form elements for user comprehension, aiding the association between labels and inputs. Logical groupings and proximity are also maintained in the layout of form elements within the login box and BMI calculator form, making it easier for users to understand and interact with the content.
