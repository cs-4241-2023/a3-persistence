

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
- Design Achievement 1: Somewhat ollowed CRAP design practices.
    - For size, I made the header on top xxx-large in CSS, while keeping the rest of the text the same size for consistency. Regarding colors, I made the background of the site a darker blue, while I made everything else red(with the exception of the buttons and the words on them, which I made white and black respectively). I kept the fonts for all headers and labels the same, but I made headers bold while leaving labels normal. For shapes, I kept the grid boxes visible to help separate all the input sections and the results table. As for emphasis, as I mentioned earlier, I made headers bold while keeping labels the same.

    In the repetition department, I kept the font the same for all non-button text, as to not distract or confuse the users. I also made the grid boxes and text the same shade of red.

    For alignment, I kept the main header for the site centered, and put all of the input boxes on the left. This allows me to put the table on the right so the data can grow without ruining the alignment of the site.

    For proximity, I made all of the input boxes adjacent to each other so looking at one will force one to see the other. And adjacent to those is the table and the headers within it.



