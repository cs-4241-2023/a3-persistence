const LocalStrategy = require('passport-local').Strategy
const GitHubStrategy = require('passport-github').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByName, createUser) {
  const authenticateUser = async (accessToken, refreshToken, profile, cb) => {

    const user = await getUserByName(profile.username);
    if (user == null) {
      console.log("User does not exist")
      const newUser = await createUser(profile.username)
      return cb(null, newUser)
    }
    //console.log(profile)
    return cb(null, user)
  }

  passport.use(new GitHubStrategy(
    {
      clientID: 'b665fa19b967350087f6',
      clientSecret: '1999d7ae785620d10a17610dc0adcb158d73d298',
      callbackURL: "http://localhost:3000/auth/github/callback"
    },



    /*new LocalStrategy({ usernameField: 'username' },*/ authenticateUser))
  passport.serializeUser((user, done) => {
    done(null, user)
  })
  passport.deserializeUser(async (user, done) => {
    return done(null, user)
  })
}

module.exports = initialize