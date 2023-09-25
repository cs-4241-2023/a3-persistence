## Reading Log

Amanda Blanchard
https://a3-amanda-blanchard-jkwef.ondigitalocean.app/

The Reading Log application allows users to add and remove details about books they have read, including the title, author, start/end date, and rating. Users can edit the rating of the book after they have logged it. Some challenges faced during this application was rendering each request. In A2, my method for displaying the data didn't carry over well, so I had to rethink this to ensure the data was being updated as items are added, removed, and editted. I choice to do the GitHub authentication strategy due to the challenge it imposed. It was challenging to implement but helped me learn a lot more about oauth. I used Bootstrap as the CSS framework due to its popularity and wanted to get more experience with it. It was helpful for formating input form and table. I modified the buttons and colors of text in a CSS file.
I used cookie-parser to help with storing and managing the cookies in the application. I used dotenv to hold environmental variables that were held secret. I used Axios for HTTP requests outside of the browser due to CORS errors I was getting. Body-parser was used for JSON parsing with each get/post/put/delete request. I used Morgan for logging when developing the application. I used Github's Octokit to get the name of the account logged in to use with the database. 


## Technical Achievements

- **Tech Achievement 1**: I used OAuth authentication via the GitHub strategy. I added get methods for the oauth and the callback. Git Oauth allows for anyone with a Github account to log in and their username is used in the database to adknowledge their data.

- **Tech Achievement 2**: I used hosted my application on Digital Ocean. When testing with Glitch, there were many errors, such as time out errors, that happened when trying to host my application. I tried Heroku at first, and was still running into errors but Digital Ocean did not give time out errors and was able to host my application without any issues. 

### Design/Evaluation Achievements

- **Design Achievement 1**: CRAP Principles:
 I used Contrast throughout my application to draw emphasis to various areas. I made titles and buttons a different color to draw attention to those important aspects. In addition to color contrast, in my table, I used bold emphasis on the table header to add contrast in the table that allows the audience to see the headers easily. I used the Bootstrap style of striped table rows to help with contrast in each row of the table to identify the differences. I used size for contrast when using various tags (h1, h2, h3, h4). The size contrast also assist to draw attention to the important aspects of the pages through making more import aspects larger. I used contrast by adding different colors to the modal to show that is it different than the page being shown. This contrast allows for more attention to be drawn to it for updating the rating.
I used repetition for the rows in the table to ensure they followed the same format. The table rows all follow the same format to ensure repetition for good design. I used consistent colors and style throughout the application through using the Bootstrap framework. I ensured all the input labels were consistently layed out and matching in size. I styled all the buttons the same in the application. The same font was used throughout as well to ensure all the styling matched. The same colors were used throughout, including white, red, and grey for simplicity. The design between pages contains similar elements and styling for repetition purposes. I kept the same font even with the contrast in the modal. 
The alignment principle was used to center important aspects that needed more attention and keep the other elements on the left side. Alignment helped support contrast through making the alignment of higher attention objects to be different than the rest of the application. I used layout alignment such as vertical and horizontal alignment for the modal used when editing the values. This modal appears in the direct center of the page to draw attention to it rather than the other elements on the page. I aligned all the table elements on the left for consistency and easier readability. 
I used proximity for organizing all the visual information on the page. I kept all the elements on the log in page close in proximity due to the small amount of information on the page and wanting the user’s focus on the top elements of the page for log in. I made the form fields close to each other for easier readability and to ensure focus stays on these elements. I used a table to ensure all the data elements were close in proximity but spaced out enough to prevent overlap of text. 

