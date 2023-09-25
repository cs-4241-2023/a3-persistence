Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template

===
Ansel Chang

This is hosted on Heroku at https://calorie-counter-87a47dc49720.herokuapp.com/
The benefit is much faster website loading time. It also allows for setting a remote directly, so it's super easy to make changes and push.

This website features a calorie and protein tracker to make dieting easy! Simply log food entries and the calculator will determine your current calorie and protein counts and how much left towards the goal you've set.

Each user can store their own list of entries, as well as their own goals! Entries can be created and deleted, and goals can be modified. Entries and Users are stored through a MongoDB database for persistent storage. Each user has their own protein/calorie goals, and each entry stores the name of the associated user, to differentiate between users. This way, only the relevant entries are displayed to the user. I use an express server, and have an API for logging in, setting goals, and adding/removing entries. The log in page features both account creation and logging in, checking with the server for authentication.

I faced a few challenges:
- CSS was a huge pain to get remotely looking good at all
- I struggled with OAUTH for a while but encountered issues with invalid access tokens and eventually gave up, settling for my own authentication system

I chose just storing (username, passwords) into MongoDB as my authentication strategy as it was the easiest, although I did want to give Github OAUTH a try.

I used https://picocss.com/ CSS framework for its sleek and simple design. I didn't like their color scheme, and I changed some paddings around to maintain the original protein/status section spacings, as picocss did not support dashboard-like stylings well.

Express middleware:
- express: It is the Express framework itself, and it's used to build web applications on the server side.
- express-session: It's a middleware for Express to manage sessions, which are used to keep track of users as they navigate through the application. In my app, when a user logs in, it creates a session, which identifies the user as they make requests for entries
- body-parser: It's another middleware for Express, used to parse incoming request bodies, making it easier to extract parameters from POST requests in Express.
- passport: authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped into any Express-based web application. Was used in attempts for Github OAuth
- morgan: a HTTP request logger middleware. It helps in logging requests, which is useful for debugging.

Lighthouse scores:
- 100% Performance
- 93% Accessibility
- 100% Best practices
- 90% SEO


W3C tips followed:
- Provide informative, unique page titles. In the login page, I specify that in the title to distinguish it from the main page
- Provide clear instructions. In the new entry form, I have instructions for the type of text to be entered, and it provides feedback in the form of an error if not correct.
- Keep content clear and concise. The text is minimalist and tries to convey info in the most direct way
- Provide sufficient contrast between foreground and background. Text color was changed for more contrast.
- Don’t use color alone to convey information. In the message displayed after submitting a new form, not only does color convey whether it was valid, text indicates it in more detail.
- Ensure that interactive elements are easy to identify. Buttons when hovered change the mouse cursor
- Ensure that form elements include clearly associated labels. All the entry form values are labelled clearly.
- Provide easily identifiable feedback. When logging in or submitting entry form, feedback is right below the button.
- Use headings and spacing to group related content. I use gaps and margin-bottom to space out sections.
- Create designs for different viewport sizes. If sufficieenlty small viewport size, the two protein/calorie statuses are collapsed into a single column
- Associate a label with every form control. All the entry forms are labelled.
- Use mark-up to convey meaning and structure. I use semantic html like <header> and <section>

The four CRAP principles:

In my site, contrast has been utilized to guide the users' eyes and to highlight the importance of various elements. The header of each page has been rendered with a larger font than all the other text, receiving the most emphasis. This allows users to quickly identify the purpose or topic of each page. Additionally, contrasting colors are employed to distinguish actionable elements like buttons from other graphical units, promoting user interaction and enhancing the overall user experience. This utilization of contrast helps in shaping a clear and concise visual hierarchy within the site.

Repetition is subtly woven throughout the site to foster a sense of coherence and unity, aiding in navigation and overall visual appeal. I have consistently used a select palette of colors and a single family of fonts across all pages, establishing a recognizable visual identity. The calories and protein status panels follow identical layouts, and each entry is organized with the name on the left and info on the right. This repetitive design strategy fortifies the site's identity and helps users build familiarity as they navigate through different sections, enhancing user engagement and satisfaction.

Alignment has been a crucial principle in organizing information and creating a structured, cohesive appearance throughout my site. This site is clearly divided into four sections: the header which shows the title and the user, with the edit button aligned next to it; the protein and calorie status, which are aligned into two columns and provide a dashboard-like view; the new entry form with each form element aligned consistently; and the entries, aligned as a vertical list. This alignment not only organizes information efficiently but also increases contrast for particular elements, aiding in highlighting their importance and improving the visual harmony of the design.

Proximity is employed to organize visual information effectively and to establish clear relationships between different elements on our page. Elements related to each other are grouped closely, creating distinct visual units that are easily recognizable and understandable. All the user info is mentioned at the top, all the status info about the protein/calorie goals and how close they are being achieved are grouped into the two orange boxes, where the calories info and protein info are segregated into two columns, the new entry form is compact and contains all the necessary info, and the list of entries is grouped in the bottom. This utilization of proximity enables users to process information effortlessly, leading to a more intuitive and user-friendly interface, and it assists in avoiding unnecessary clutter and confusion by clearly delineating associated content.









