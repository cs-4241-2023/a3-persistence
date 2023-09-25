Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===

Due: September 25nd, by 11:59 AM.

This assignnment continues where we left off, extending it to use the most popular Node.js server framework (express), 
a database (mongodb), and a CSS application framework / template of your choice (Boostrap, Material Design, Semantic UI, Pure etc.)

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
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative:
- Make link text meaningful: I made sure that all of my links have meaningful text, such as "Login with Github" instead of just "Login".
- Provide informative page titles: The page titles are informative and describe the page, which includes 'Blogging App' to describe the app.
- Ensure that interactive elements are easy to identify: The logout link is highlighted during mouse hover.
- Create designs for different viewport sizes: I used Tailwind's responsive breakpoints to make the site responsive, modifying margin sizes for mobile devices.
- Write code that adapts to the user’s technology: I used Tailwind's responsive breakpoints to make the site responsive.
- Ensure that all interactive elements are keyboard accessible: Added aria labels to buttons like submit, as well as roles for the form elements.

