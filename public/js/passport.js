const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;

// Replace these with your GitHub OAuth App credentials
const GITHUB_CLIENT_ID = "72b095d0fb69787072d8";
const GITHUB_CLIENT_SECRET = "4b9068da33a1cc5e769568f7e8524edf1cd3130d";

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback", // Adjust for your environment
    },
    function (accessToken, refreshToken, profile, done) {
      // You can perform user-related tasks here, such as storing the user in a database
      // The 'profile' object contains information about the authenticated user
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

module.exports = passport;
