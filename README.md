## Project Management Site
Nathaniel Sadlier https://a3-nathaniel-sadlier.glitch.me/

This project is an website that allow one to create an account and create a list of projects (the only current functionality is creating a name for the project) that are stored using mongoDB. To create an account, enter a username and password that have not been used yet and an account will auto create. To add, remove, or update project names follow the labels and click the corresponding button. As of submissionm, only 1 account exists with the username "test" and the password "a".

When making the project, the biggest challenge was creating an express server and familiarizing myself with the new syntax that came with it.

The chosen authentication strategy was a simple password comparison to what is stored in the database. This was a quick method to implement which is why it was chosen but it is not very secure.

The chosen CSS framework was modern-css-reset by Andy-set-studio because it was a a simple but clean framework that made the content more readable than what it was originally.

The middleware used was a simple check that the database was still connected anytime it tried to pull or update any information.

## Technical Achievements
- **Tech Achievement 1**: The website scores a 100 on all the Lighthouse tests. A screenshot named "lh100.PNG" is included in the repo that shows this but it should also score a 100 when ran on the provided link

### Design/Evaluation Achievements
- None

