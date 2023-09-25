Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 25th, by 11:59 AM.

Adelynn Martin
Abmartin25
Glitch: [https://a2-abmartin25.glitch.me](https://a3-abmartin25-adelynn-martin.glitch.me)

# Recipe Tracker

Recipe Tracker is a web application that allows users to track their recipes. Users can add new recipes, delete existing recipes, and view their recipe list. The application utilizes CSS Grid for layout and incorporates Google Fonts for improved typography.     Authentication Strategy: I chose to use JSON Web Tokens (JWT) as the authentication strategy for this project. One key reason for this choice is its simplicity and ease of implementation. JWTs can be easily passed in the headers, allowing for scalable services. Moreover, this strategy supports a variety of signature methods, giving a degree of flexibility in terms of security options for future building.

    CSS Framework: The Bulma CSS framework was employed for styling the frontend. Bulma is known for its responsiveness and modular architecture, making it a good choice for projects that require scalable and maintainable code. It offers an array of pre-built classes and components, which speeds up the development process considerably. In terms of custom CSS, I authored additional styles to adjust the spacing between specific elements, as well as to implement color variations that are more consistent with the branding guidelines for the project.

    Express Middleware Packages:
        Body-Parser: This middleware parses incoming request bodies, making it easier to extract parameters in various formats such as JSON, text, or even files.
        Cors: Cors (Cross-Origin Resource Sharing) middleware enables CORS with various options, allowing the server to interact securely with requests from different origins.
        Morgan: This is a logging middleware that records and shows all HTTP requests made to the application, aiding in debugging and monitoring.
        Helmet: Helmet helps secure the application by setting various HTTP headers, mitigating some common security risks.
        Express-Session: This middleware manages session data between HTTP requests, providing a way to persist user data across multiple client interactions.


## Tasks

### Base Assignment 1
- a `Server`, created using Express (located in server.improved.js)
- a `Results` functionality which shows all data associated with a logged in user (when logged in the data appears in a table located at the bottom)
- a `Form/Entry` functionality which allows users to add, modify, and delete data items (There are add and delete subheadings, to modify existing data, users can click on cells that want to edit and click enter to save, this is not inherently intuitive web design so a caption is located to explain this)
- Persistent data storage in between server sessions using [mongodb] (also located in server.improved.js-I used Atlas)
- Use of a [CSS framework or template]: Mine is "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"


HTML:  
- HTML input tags and form fields of various flavors (Shown all throughout HTML)
- HTML that can display all data *for a particular authenticated user*. Note that this is different from the last assignnment, which required the display of all data in memory on the server. (Users that arent logged in/have an account cannot see any data at all)


General:  
- Your site should achieve at least 90% on the `Performance`, `Best Practices`, `Accessibility`, and `SEO` tests 
using Google [Lighthouse]
![image](https://github.com/abmartin25/a3-persistence/assets/101657738/d8c6de9d-8d4b-4e43-ba31-5feb6105d79c)


Acheivements
---

Below are suggested technical and design achievements. You can use these to help boost your grade up to an A and customize the 
assignment to your personal interests, for a maximum twenty additional points and a maximum grade of a 100%. 
These are recommended acheivements, but feel free to create/implement your own... just make sure you thoroughly describe what you did in your README, 
why it was challenging, and how many points you think the achievement should be worth. 
ALL ACHIEVEMENTS MUST BE DESCRIBED IN YOUR README IN ORDER TO GET CREDIT FOR THEM.

*Technical*

- (5 points) Instead of Glitch, host your site on a different service like [Heroku](https://www.heroku.com) or [Digital Ocean](https://www.digitalocean.com). Make sure to describe this a bit in your README. What was better about using the service you chose as compared to Glitch? What (if anything) was worse?   
I tried out Heroku to compare to Glitch. Glitch seemed to be aimed way more towards hobbyists than Heroku which appeared to have more tools and integrations available within it. It seemed to be used for dev teams and more reliable than Glitch.

*Design/UX*

- (5 points) Describe how your site uses the CRAP principles in the Non-Designer's Design Book readings:
  In the revised HTML layout, the CRAP principles (Contrast, Repetition, Alignment, Proximity) from the Non-Designer's Design Book are strategically utilized to enhance user experience and site usability.

    Contrast: The most emphasized element on each page is the main title ("Recipe Tracker Login" and "Recipe Tracker"). Utilizing the 'title' class provided by the Bulma CSS framework, these headings are noticeably larger and bolder compared to other text on the site. This serves to immediately draw user attention to the main purpose of each section, thus improving readability and focus. Furthermore, the usage of boxes around the forms provides a contrasting background that distinguishes these interactive elements from the surrounding content, aiding users in quickly identifying where input is required.

    Repetition: Consistent design elements are essential in creating a coherent and navigable interface. The site employs a unified color scheme, leveraging the 'is-primary' and 'is-danger' classes for buttons to indicate primary actions and deletion respectively. The same font family is used throughout the website to maintain typographic consistency. Additionally, the 'field', 'control', and 'label' classes are repeatedly utilized for form elements, standardizing the visual presentation and facilitating ease of use for the end-user.

    Alignment: The revised design places a strong emphasis on alignment to ensure visual coherence and flow. Elements within each form are left-aligned, making the layout easier to scan and read. This also creates a vertical line that guides the user's eyes down the page. Furthermore, the usage of columns for the Login and Register sections aligns these two forms horizontally, thus providing a balanced look and making it visually evident that these two forms are peer elements serving different functionalities.

    Proximity: Proximity is employed to logically group related elements together and to segregate unrelated ones. Each form and its associated fields are tightly grouped, encased within a 'box', indicating their relatedness. Moreover, titles and subtitles are strategically placed near their respective sections to offer contextual cues without requiring additional explanation. This effective use of proximity aids in reducing cognitive load, as users can easily associate related elements while also distinguishing between different sections of content.

In summary, the revised HTML layout utilizes the CRAP design principles in a manner that optimizes readability, user navigation, and overall aesthetic appeal. This results in a webpage that is not only functionally effective but also visually engaging.
