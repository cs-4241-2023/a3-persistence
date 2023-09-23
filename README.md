Assignment 3 - Persistence: Two-tier Web Application with Database, Express server, and CSS template
===
Due: September 22nd, by 11:59 AM.

Acheivements
---
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

- The goal of this application is to have a database of your esports players (coming from the perspective of a esports captain.)
- A lot, I had to rename stuff to gamertag, the database I had a hassle on envisioning how I'd set it up and how'd I would create a "relation". I struggled with a lot of small bugs... but I spent a few days googling and rewriting code to make sure things sailed smoothly. 
- Currently at the moment, I use cookies as authorization and I didn't implement OAuth.
- I used the water css framework because I love the simplistic blue tones that it gave my login page. It reminded me of my darker purple tones I had previously.
  - The only modifications I made at this point was just some padding and flexbox adjustments. 
- The middle wares I used were GET/Delete/Post/Edit/Use where they essentially did as their name implies. They define a route where I can send submit/get/delete/etc to my client and allow me to have a place to have mongoDB perform those actions. I've also added a root URL handler to direct my page to my login rather than my index.html. As well as POST for my login and registration calls. 

## Technical Achievements
- **Tech Achievement 1**: I got a 100 on the lighthouse scores, can provide a screenshot if needed. 

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative...
