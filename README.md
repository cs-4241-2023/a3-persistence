<h1>Simple Digital Library </h1>
Aashi Mehta <br>
https://a3-aashimehta.glitch.me <br>
**Glitch was not loading my site when I uploaded my project but it worked locally so I'm not sure if this link will provide results**


The goal of this application is for users to be able to sign in, track the books they've read, 
modify the books in their library, and delete them. This application shows how long it took for the user to read a book
provided they give valid date inputs. 

I struggled to implement the login system and had to start over several times, I tried different methods of 
doing this as well. 

I attempted to use cookies as my authentication system however I'm not sure that it worked.
I had /login requests to my server manually check to see if the username and password matched.
I picked this authentication system because it was the easiest to figure out. 
I used the chota framework because it was lightweight and simple to implement. 


Middlewares:
express.static('public'): serves static files such as HTML, CSS, and JavaScript from the "public" directory, making them accessible to the client.

express.json(): parses incoming JSON requests, making the JSON data available in the req.body object.

express.urlencoded({ extended: true }): parses incoming URL-encoded form data from default form actions, making it available in the req.body object.

cookie(): Uses the cookie-session package. It is responsible for handling session cookies, including generating session keys and managing user sessions.

(req,res,next): serves as a check to ensure that the collection variable is not null before allowing the request to proceed. If collection is null, it sends a "Service Unavailable" (503) response. Otherwise, it calls the next() function to pass the request to the next middleware.


<h2>Design Achievements</h2>
I implemented the tips from W3C to make my website accessible

- Provide sufficient contrast between foreground and background: each section is a distinct color
- Don’t use color alone to convey information: all of my information is conveyed using words
- Ensure that interactive elements are easy to identify: all of my buttons and elements are clearly presented
- Provide clear and consistent navigation options: page navigation is done with the use of buttons and scrolling
- Ensure that form elements include clearly associated labels: every form element has a distinct label
- Provide easily identifiable feedback: feedback is in console.log and on the webpage
- Use headings and spacing to group related content: elements are adequately spaced out and not squished together
- Create designs for different viewport sizes: there is a meta viewport tag in the html files
- Include image and media alternatives in your design: there are no forms of media that would require alternatives for those who are disabled
- Provide controls for content that starts automatically: no content starts automatically, everything is done based on user interaction