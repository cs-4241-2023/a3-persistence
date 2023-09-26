Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===
## Blogging App

Glitch: http://a3-randy-huang.glitch.me

My app is a blog that allows users to create posts and update them, along with reading times for each post. I faced some challenges with setting up the Tailwind configuration, but I was able to get it working. I used GitHub Strategy because it was required in the technical achievement. I used Tailwind because I liked the look of it and utility classes. I used my previous CSS as a base and then added Tailwind on top of it. I also used Axios for HTTP requests.

Express middleware packages:
- express-session: This package allows me to use sessions in my app.
- passport: This package allows me to use passport.js for authentication.
- mongoose: This package allows me to use MongoDB in my app.
- passport-github: This package allows me to use the GitHub strategy for authentication.
- ensureAuthenticated: This is a custom middleware function that I wrote to ensure that a user is authenticated before they can access certain pages, and otherwise redirects them to the login page.

## Technical Achievements
- OAuth authentication via GitHub: I used passport.js and the GitHub strategy to implement OAuth authentication. I faced challenges regarding configuring the different routes, but got it working.
- Lighthouse: The site scores 100% on all four lighthouse tests (performance, accessibility, best practices, SEO).

### Design/Evaluation Achievements
- **Accessibility**: I followed the following tips from the W3C Web Accessibility Initiative:
- Make link text meaningful: I made sure that all of my links have meaningful text, such as "Login with Github" instead of just "Login".
- Provide informative page titles: The page titles are informative and describe the page, which includes 'Blogging App' to describe the app.
- Ensure that interactive elements are easy to identify: The logout link is highlighted during mouse hover.
- Create designs for different viewport sizes: I used Tailwind's responsive breakpoints to make the site responsive, modifying margin sizes for mobile devices.
- Write code that adapts to the user’s technology: I used Tailwind's responsive breakpoints to make the site responsive.
- Ensure that all interactive elements are keyboard accessible: Added aria labels to buttons like submit, as well as roles for the form elements.

