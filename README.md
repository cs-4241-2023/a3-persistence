## Car Database

http://a3-bman4.glitch.me

## LOGIN INFORMATION

I have setup four accounts in the login database for testing purposes. Here are the logins below in the format (username, password):

(admin, admin)

(tester, test123)

(cooldog, dogz)

(tree, forests)

## Project Info

Goal - the main goal of this application is to create a site for users to enter information about cars while also seeing a calculated
rating value to give a way to differentiate cars based on their attributes.

Challenges - one big challenge I faced building this application was trying to setup MongoDB and make sure all my GET, POST, PUT, and DELETE
calls all functioned the same since it's a lot different than just storing information in a backend array. Another big issue I encountered was
setting up sessions and ensuring that people can't reach and access pages they shouldn't be able to access.

Authentication Strategy - I ended up choosing to use a basic authentication strategy of checking for a username and password combo in the login
database, and showing information based on username. If I had more time I would have liked to look into the github authentication strategy.

CSS Framework - the CSS framework I ended up choosing was Tacit. I chose Tacit mainly because I don't particuarly enjoy designing web pages too
much, and Tacit did a lot of the work for me. I also found it looked very clean and modern compared to some of the other frameworks I looked at.

Middleware Packages Used -

1. Express was the main middleware package I used. Express was used a ton in my backend code to help simplify many of the basic
   operations of the backend such as serving pages, redirecting, and handling requests.
2. MongoDB was also an extremely helpful package since it was necessary to form connections to my MongoDB database. This package also helped a lot
   when requesting and querying certain information from the database, such as data from certain users.
3. Cookie-Session was quite impactful in creating sessions for different users when logging in. This helped a lot in ensuring that people without
   a session can't reach certain pages, and also allows users to refresh the page and still have access to the right data.
4. Crypto package was only used to generate large random numbers for creating sessions, to ensure better application security.

### Design/Evaluation Achievements

- **Design Achievement 1**: I followed the four CRAP principles

Contrast:
On the login page, contrast is evident in the use of a high-contrast color scheme. The background is white, while the login form is contained within a
contrasting gray box. The form elements, such as the input fields and the "Log In" button, are darker than the background, making them stand out. The
text fields use a consistent dark gray color for placeholders and input text, providing visual consistency. Moving on to the main page, contrast is achieved
through a consistent color scheme, with a white background and darker gray text elements. The table headers, "Model," "Year," "MPG," and "Rating,"
receive the most emphasis in terms of contrast, as they are bold and larger than the table data below. This contrast helps users quickly identify the
purpose of each column.

Repetition:
Repetition plays a crucial role in ensuring a consistent and cohesive visual identity for your website. Throughout both pages, a clear and decisive design
language is established, thanks to the deliberate repetition of design elements. A notable example of repetition is the consistent use of the "Quicksand"
font family for all text elements. By maintaining the same font style and size, you create a unified and easily recognizable typography that reinforces brand
consistency of your site. This repetition in font choice not only contributes to a clean and modern aesthetic but also ensures that users encounter a familiar
view, promoting a sense of trust and professionalism. This style of repetition can also be seen through the use of the "Tacit" CSS framework that is used on
both pages. This again highlights the consistency of design between the two pages, and makes the user feel more comfortable navigating the website.

Alignment:
Alignment is used to organize information and create a sense of order on both pages. The login page aligns the login form centrally, creating a balanced layout.
The form elements are vertically aligned, creating a sense of order and making it easy for users to understand the form's structure. On the main page, alignment
can be seen in the horizontal alignment of table headers and data. The headers align with the respective columns of data below them, making the tables easier to
understand. The "Delete" and "Modify" are aligned horizontally with the each row of data to make it easy to understand for the user what data they are deleting
or modifying. On the top of the page, the "Submit" button also aligns well horizontally with the form entry data to make it easy to comprehend what data you are
submitting and how.

Proximity:
Proximity is used to group related information and separate different sections of content. On the login page, the proximity principle is applied by placing the
"Username" and "Password" input fields close to each other within the login form. This grouping helps users understand that these fields are part of the same
action of logging into the page. On the main page, proximity is demonstrated in the layout of the table. Each row of car data is grouped together, with clear
separation between rows. The headers are in close proximity to the data they describe, making it easy for users to associate each header with its corresponding
data. The "Delete" and "Modify" buttons are also located close to the rows they represent, making it easy to follow what the user is deleting or modifying.
