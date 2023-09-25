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
