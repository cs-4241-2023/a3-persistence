

## Shows To Watch

your glitch (or alternative server) link:
Live Server: https://spiced-ajar-servant.glitch.me
Code: https://glitch.com/edit/#!/spiced-ajar-servant


- Acts as a watchlist, where you store shows/movies you are planning to watch and receive information on the shows relevance.
- Challenges I faced in realizing the application:
    - Understanding how MongoDB works, and configuring the admin user and password (succeeded)
    - Getting the objects containing the data to have unique IDs upon submission (succeeded, but in a way I'd advise against)
        - Specifically, I increment the IdNum inside the a loop within the submit function, a loop which is executed once for every row (including
          the one that was just submitted, making the values unique but ever-increasing at an ever-increasing rate)
    - Getting delete to work (failed)
- What authentication strategy you chose to use and why:
    - None, time constraints/classes conflicting with office hours.
- What CSS framework you used and why:
    - Bootstrap, simply because I saw it first.


