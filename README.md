## Vehicle Service Log Tracker

Web Application Link: https://a3-ngrozdani.glitch.me/

<img width="1369" alt="Screen Shot 2023-09-23 at 4 43 57 PM" src="https://github.com/ngrozdani/a3-persistence/assets/64702995/add407ca-dff9-4163-a712-6f0dd750b57f">


## Application Summary

The "Vehicle Service Log" web application is designed to assist users in managing and tracking their scheduled vehicle service appointments. Users can register an account, log in, or use GitHub OAuth for immediate access. They have the ability to add, modify, and delete service appointments.

## Authentication Strategy

For authentication, this application employs OAuth authentication via GitHub. This approach offers several advantages, including simplified user registration and login processes, enhanced security, and access to user information through the GitHub API. However, implementing GitHub OAuth posed certain challenges, such as handling authentication callbacks.

The effectiveness of GitHub OAuth lies in its seamless integration with GitHub accounts, reducing the need for users to create yet another set of credentials. It also provides a level of trust and familiarity for users who are already GitHub users. Challenges included managing the callback URL, verifying the authenticity of GitHub responses, and handling various authentication states.

## CSS Framework

This application utilizes Pure CSS for styling. Pure CSS is chosen for its simplicity, efficiency, and adherence to web principles. It offers preset styles that make it easy to create a visually appealing and user-friendly interface. The framework also facilitates responsive design, ensuring that the application looks and functions well across different devices and screen sizes.

Custom CSS modifications were made to tailor the styling to the specific requirements and aesthetic preferences of the application. 

**1. Color Scheme Customization**

The default color scheme of Pure CSS was adjusted to reflect the branding and aesthetic preferences of the "Vehicle Service Log" application. Particular attention was given to color choices for buttons, headers, and elements such as form inputs to create a cohesive and visually pleasing user interface.

**2. Small Alignment Tweaks**

To enhance the overall user experience, small alignment adjustments were made to various elements. This included refining the placement of navigation menus, buttons, and content sections to ensure an intuitive and user-friendly layout.

These customizations allow for a unique and cohesive visual identity while still leveraging the advantages of the Pure CSS framework. 

## Middleware Packages

The following Express middleware packages were used in the development of this application, each serving a specific purpose:

1. Passport.js: Passport is used for authentication and integrates seamlessly with GitHub OAuth to handle user authentication and authorization.
2. express.json(): This middleware parses incoming JSON requests, making it easier to work with JSON data within the application.
3. authNavigator (Custom Middleware): Custom middleware responsible for navigating users to different parts of the application based on their authentication status. It redirects authenticated users to their dashboard and unauthenticated users to the login page.
4. stringToJSONMiddleware (Custom Middleware): Custom middleware designed to parse incoming JSON-like strings into valid JSON objects. This aids in handling data from the GitHub OAuth callback, which arrives as a string.
5. express-session: Express session management middleware is used to store user session data securely, allowing the application to maintain user authentication state throughout their session.
6. express-static: Used to serve static files like HTML, CSS, and JavaScript, ensuring smooth frontend functionality.
7. express.urlencoded(): Express.urlencoded() is another essential middleware for handling incoming data. It parses incoming URL-encoded data, enabling the application to process form submissions and other URL-encoded payloads effectively.

## Challenges Faced:

**1. User Authorization**: It was important to guarantee the authenticity of responses from GitHub to prevent unauthorized access. Striking the right balance between user-friendly login processes and robust security measures was a smooth task. Ensuring that users attempting to log in were legitimate GitHub users while maintaining a seamless user experience was a complex challenge.

**2. Authentication Callback Handling**: Managing the intricacies of authentication callback handling proved to be one of the most demanding challenges. GitHub OAuth authentication relies on a callback mechanism, and ensuring its correct configuration and secure handling of incoming data was crucial. Dealing with the asynchronous nature of callbacks and redirecting users appropriately added an extra layer of complexity.

**3. Middleware Integration**: Integrating multiple middleware packages, including custom middleware, was necessary for the application's functionality. This process required careful consideration of the order of middleware execution, ensuring they worked seamlessly together, and managing potential conflicts or compatibility issues.

## Technical Achievements
- Tech Achievement 1: Implemented GitHub OAuth authentication using Passport.js, providing users with a secure and streamlined login experience.
- Tech Achievement 2: Achieved a perfect score of 100% in all four Lighthouse tests, ensuring exceptional performance, accessibility, best practices, and SEO optimization for the application.

## Design Achievements

**1. Accessibility Implementation**

To ensure accessibility for my "Vehicle Service Log" web application, I actively followed twelve tips provided by the W3C (World Wide Web Consortium). These tips spanned writing, designing, and development aspects of the site, contributing to a more inclusive user experience. 

Here are some of the key tips I implemented:

**Alternative Text for Images**: I made sure that every image used in the application includes descriptive alt text, making the content accessible to users with visual impairments.

**Semantic HTML**: I used semantic HTML elements such as <nav>, <main>, and <footer> to structure the content logically, aiding screen readers in understanding the page's hierarchy.

**Keyboard Navigation**: I ensured that all interactive elements, including forms and buttons, could be navigated and activated using only the keyboard, providing accessibility for users who rely on keyboard navigation.

**Contrast Ratio**: I carefully chose the color palette to meet contrast ratio requirements, making text content readable for users with low vision.

**Form Labels**: I made sure that all form fields have associated <label> elements, enhancing usability and accessibility for screen reader users.

**Focus Styles**: I implemented custom focus styles to ensure that keyboard focus indicators were clearly visible, aiding users in identifying the selected element.

**Semantic Headings**: I used properly structured headings throughout the site, helping screen reader users understand the content's organization and flow.

**ARIA Roles and Attributes**: I applied ARIA roles and attributes where necessary to enhance the accessibility of dynamic elements, such as modal dialogs and dynamic content updates.

**Error Messages**: The website provides concise and comprehensible instructions, as well as error messages that guide users through form completion and help them address any mistakes efficiently.

**User Responsiveness**: The website employs responsive design techniques to seamlessly adjust its layout and content presentation, guaranteeing a uniform user experience across a range of screen sizes and zoom levels.

**Testing with Screen Readers:** I conducted extensive testing with popular screen readers to identify and address any potential accessibility issues.

**2. CRAP Principles in Design**

My "Vehicle Service Log" web application incorporates the CRAP (Contrast, Repetition, Alignment, Proximity) design principles from the Non-Designer's Design Book readings to create a visually appealing and user-friendly interface.

**Contrast**: I emphasized contrast through the careful selection of colors and font styles. High contrast between text and background ensures readability, with dark text on a light background for optimal legibility.

**Repetition**: I maintained consistency throughout the site using repeated design elements. A consistent color palette, typography, and button styles create a cohesive visual identity.

**Alignment**: I aligned elements such as headers, forms, and buttons to maintain a clean, consistent, and structured layout. I used left alignment predominantly for readability and a professional appearance. All of these choices played a crucial role in organizing information and enhancing contrast.

**Proximity**: I used proximity to group related elements and organize visual information logically. For instance, I placed form fields and their labels closely together, and grouped navigation links together in the header, improving user comprehension and navigation efficiency.
