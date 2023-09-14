# Expense Tracker

### Live on Render: https://cs4241-assignment3.onrender.com/
**Username:** cs4241

**Password:** ihatejs

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
