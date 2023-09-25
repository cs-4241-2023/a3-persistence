# Statistics Tracker for Counter-Strike: Global Offensive
Author: Thomas Pianka

Glitch link: https://a3-thomas-pianka.glitch.me/

- This project is intended to be used as a statistics tracker for the game Counter-Strike: Global Offensive. The user can input their statistics from each match, and the app will store that information, while also calculating the K/D ratio based on the inputted statistics and displaying that to the user, alongside the other statistics associated with the user's account.
- One challenge I faced was implementing the CSS framework, as I have never used a CSS framework before. I had to figure out how to apply it to my application, and then I had to reformat and modify the application to make it look clean and comply with accessibility requirements. Another challenge I faced occurred when I was implementing `express-handlebars` for server-side rendering. My browser console was indicating that there was an incompatibility between the MIME type and file types of my .js and .css files. To solve this, I added a slash before the file names of my .js and .css files when linking to them in my .html file, and I added the `type` parameter to specify the file type of my .js and .css files. These two modifications fixed the MIME type issue and improved the performance of my website.
- I chose to authenticate by allowing the user to input their username and password via vanilla HTML `<input>` tags, and providing both a login and register button. I use `express-handlebars` to perform server-side rendering to display any errors a user might run into while logging in or registering, such as an incorrect password or a username already existing.
- I used Pico.css for my CSS framework because it appeared that it would make my application look nicer while allowing me to maintain my flexbox formatting. The only modifications I made to the default CSS framework rules were text color changes for `h1`, `h2`, `h3`, `th`, and `td` tags.
- The first middleware package I used is `cookie-session`, which allows me to remember a user session after the user logs in, even if they refresh the page or navigate forward and back. The second middleware package I used is `express-handlebars`, which allows me to perform server-side rendering on my login page to display errors a user may run into while trying to login or register.

## Technical Achievements
- **Tech Achievement 1**: I achieved a 100% in all four Google Lighthouse tests on both my login page and my main application page. Proof of the scores are shown below.

  ![Screenshot displaying a 100% in Google Lighthouse for my login page](<Login Page Lighthouse Results.png>)

  ![Screenshot displaying a 100% in Google Lighthouse for my main page](<Main Page Lighthouse Results.png>)

## Design/Evaluation Achievements
- **Design Achievement 1**: I made my site accessible using tips from the W3C. Below are the twelve tips I followed and what I did to implement them:
  1. **Provide informative, unique page titles:** I modified the title of my login page to differentiate it from my main page.
  2. **Use headings to convey meaning and structure:** I added header tags to both my login page and my main page to provide a better description of how to operate the pages and how the pages are split up.
  3. **Provide clear instructions:** I added server-side rendering to notify the user of any problems while logging in or registering, and I added header tags with instructions on how to interact with the elements on my pages.
  4. **Provide sufficient contrast between foreground and background:** I made sure that adjacent colors on my pages were different enough so that nothing was hard to read. This change is reinforced through a 100% score in accessibility in Google Lighthouse on both of my pages.
  5. **Don't use color alone to convey information:** In addition to highlighting required fields in red, I added an asterisk to the placeholder of each `<input>` element to indicate they are required, as well as text explaining what the asterisk means.
  6. **Ensure that interactive elements are easy to identify:** All of the interactive elements on my page such as buttons and inputs have been made easily identifiable as such, and the cursor changes depending on whether the user is hovered over a text input or a button.
  7. **Provide easily identifiable feedback:** When a user inputs an invalid username/password combination or does not fill out all of the statistics input fields, there appears a clear message indicating what the issue is.
  8. **Use headings and spacing to group related content:** I added headings to differentiate between the input section of my main page and the data display section of my main page while also adding spacing between the two sections.
  9. **Identify page language and language changes:** I have set the language of the entirety of both of my pages to English, since there are no elements that are in a different language.
  10. **Help users avoid and correct mistakes:** For both of my pages, I provide specific instructions on what the issue is and how to fix it when a form is being submitted. For example, if a user tries to log in with an incorrect password, the page will inform them that the password was incorrect, but if the user tries to log in with a username that does not exist, the page will tell them that the username does not exist and to either try to log in with a different username or register the username they are currently trying to log in with.
  11. **Reflect the reading order in the code order:** Because my pages are centered with a reading order of left to right then top to bottom, the structure of the HTML elements on my pages reflects this natural reading order.
  12. **Ensure that all interactive elements are keyboard accessible:** I ensured that through only using the keyboard, a user is able to see what interactive element they are currently on, including both buttons and input fields.

## Resources Used
- https://stackoverflow.com/questions/48778619/node-express-refused-to-apply-style-because-its-mime-type-text-html
- https://stackoverflow.com/questions/7953301/2x-submit-buttons-to-action-different-url
- https://stackoverflow.com/questions/19035373/how-do-i-redirect-in-expressjs-while-passing-some-context
- https://webaim.org/resources/contrastchecker/
- https://stackoverflow.com/questions/31402576/enable-focus-only-on-keyboard-use-or-tab-press