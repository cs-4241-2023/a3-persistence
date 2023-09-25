
## WPI Badminton Hour Tracker

Sarah Olson: A3

http://a3-sarah-olson.glitch.me

I created a web app for Badminton Club members who are using their participation in this course as a gym credit to track their progress toward their grade goal. First the user either enters or creates account information, so that they can only see their progress, and login in. The user then enters their target grade and the dates + amount of hours they attended on each day to keep track of the user's progress toward their grading goal. 

The user can also edit their grading goal and delete entries they make. 

There are two different pages, one thats a higher level overview (just showing their current goal and the number of hours they have left to acheive that goal), and a more in depth breakdown of their progress (showing their current goal, each time they logged their attendance) aswell as giving the user the ability to change their goal.

The main challenge I faced was converting my a2 iteration of this project to mongodb. I could not get it to connect without hard coding it, and still have been unable to do so with a .env on localhost. 

I have a simple username and password, the only requirement for the username and password is that it needs to be at least one character long. I chose this because it was the simpletest to implement.

For the login page I used Pure.CSS and for the Main and Dashboard page I used Pico.CSS. The reason I switched to Pico for the subsequent pages was because I was finding it nearly imposible to override certain items to get my accesibility contrast at 100%. I felt the login page was more clear with Pure.CSS, so I kept that one.

As far as custom styling I have individual style pages for each of the html pages. I kept most of the flexbox styling that I used in a2 because I liked the way it displayed information. I also kept most of the colors and border-type information grouping from a2.

I used:

cookie-session: This stores session data on the server so that it is easily accessible (for example username and password information so that the user does not have to resign in while using the page)

express-handlebars: This allows me to preform server side rendering by sending messages to html files from a server file.

## Technical Achievements
- **Tech Achievement 1**: Lighthouse 100 Score: I got a 100 for all 3 of my pages (images attached below)
![Screenshot displaying a 100% in Google Lighthouse for: Login Page](<Login100.png>)
![Screenshot displaying a 100% in Google Lighthouse for: Home Page](<Home100.png>)
![Screenshot displaying a 100% in Google Lighthouse for: Progress Dashboard Page](<Dashboard100.png>)

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative and used these 12 tips.

1. Provide informative, unique page titles:
For each one of my pages, the titles include the name of the application and a descriptive title of the purpose of that pages' contents.

2. [maybe swap] Use headings to convey meaning and structure:
I use headings to help the user, at a glance, figure out where their eyes need to go based off of the information they want to receive

3. Provide Clear instructions
On the Login Page, there are clear labels telling the user the type of information that should be entered in each field, and at the top of the page, there is a sentence differentiating the meaning of both of the buttons (Login and Register)

Additionally, on other pages where a goal needs to be entered for the first time, there are sentences explaining what the grade charts mean, and how you should submit the grade you would like to receive (in addition to the placeholders showing examples of the information that should be entered).

4. Keep content clear and concise:
I try to limit the amount of words that a user has to focus on at one time. I use short sentences that are grouped in boxes so that the information is not overwhelming and stuck in a block of text. I tried to limit the amount of words and make the words that do exist clear. 

5. Provide sufficient contrast between foreground and background
Each one of my pages has sufficient contrast between the foreground and background and this can be seen in the Lighthouse score, as I go no Accesibility points taken off for lack of contrast.

6. Don’t use color alone to convey information
For the Login Page, I use the color red to convey an error message, but also the text "Login Failed/Register Failed" to convey that there has been a failure and go on to explain why. 

This can also be seen on any page where the grade information is shown, I use colors, letters, and numbers to show the value and commitment of each grade.

7. Ensure that interactive elements are easy to identify
For the login page, the buttons (interactive) are a different shade of gray and easy to compared to the rest of the elements on the login page.

For the rest of the pages, all interactive buttons or clickable elements are denoted with an underline.

8. Ensure that form elements include clearly associated labels/Associate a label with every form control

All form elements include a label showing the user what kind of information should go into it. A clear example of this is when you are on my "Progress Dashboard" page and want to edit the Grade, the form has a label telling the user that the information you need to input here is the "New Grade".

9. Provide easily identifiable feedback/Help users avoid and correct mistakes
On the login page where there is a login or registration failure, the error message right under the buttons explains exactly what the error is. Whethere you are trying to register an existing user, or you password is wrong, you know what the problem is. 

10. Use headings and spacing to group related content
Throughout my page I use outlines to group content together. On teh Progress Dashboard page I have a box saying what the information is below and then a larger box with smaller sections inside it so that all the information is easily readable and grouped together. The goal infomation is on one side while your hour progress is on the other. It makes reading the information easier as all the content is grouped to different sections.

11. Identify page language and language changes
Each one of my pages contains lang="en" in the html tag

12. Reflect the reading order in the code order
All of my html is stuructured in the way that the user would recieve the information, so that users with screen readers are not lost. Even when some of my pages contain two side my side containers (for example in progress dashboard), all the information from one side is in a top to bottom format aswell as the other side. That way when a screen reader is being used, its not jumping from side to side, and all the grade information is read first, then the hour information