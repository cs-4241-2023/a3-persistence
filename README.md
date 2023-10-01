## Grocery Tracker

http://grocerytracker.firescythe.net/

Professor Roberts gave me an extension on this assignment.
  So I was given an extension on this assignment but I ended up being sick a little longer than I anticapted and it took me longer to finish this because of that. So sorry for the extended delay!

This is a basic grocery list maker. It keeps track of pricing per item and total price. You can reset the whole list and modify items in the list. It uses the CSS Flex/Flexbox for positioning certain elements on the page. To modify an item's price, enter a price in the price field, check the checkbox to the right of the item (or items, can modify multiple items at the same time), then click the Modify Item Price button. All items checked off will have their price in the list updated. I should note that its only the list itself that'll get the price updated. If you update the price of an item in the cart it won't reflect because it was added to the cart before the price change.

For the CSS framework I used Watercss. It's a very simple framework that took care of almost everything I needed for CSS. The only modifications I made were list styling (to remove bullets from an unordered list), positioning, and one specific text segment color.

For middleware used, I used express.json, express-session, a custom function for redirecting back to login when not authenticated.
Express.json parses the request body into json format making it easier simpler to handle server side.
Express-session keeps track of login sessions and adds the appropriate information to requests and responses.
I also use passportjs and passport-github to handle the oauth authentication. Passport serves as middleware to handle the oauth information for express and works with express-session to ensure the right information is maintained.
The one I wrote simply redirects if the request session is invalid.

I chose oauth with github for my authentication because of the challenge it imposed. This did cause me to take longer than I expected to but I couldn't be happier with what I learned from doing it. The biggest challenges I faced were oauth and lighthouse analysis adjustments.

## Technical Achievements
- **Tech Achievement 1**: Oauth via github! This was a pain but I got this running and I couldn't be prouder!
- **Tech Achievement 2**: I also got it deployed using digital ocean lol

### Design/Evaluation Achievements
- **Design Achievement 1**: 100 on all 4 Lighthouse categories! When I tested this locally I was able to obtain 100 on all 4 categories of the lighthouse analysis and I provided a screenshot in the assets directory.
Deployed i get 100 in 3 and 92 in one category because I didn't get any ssl certificates so its using http not https
