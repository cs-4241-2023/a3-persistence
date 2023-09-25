const LocalStrategy = require('passport-local').Strategy
const GitHubStrategy = require('passport-github').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByName, createUser) {
    const authenticateUser = async (accessToken, refreshToken, profile, cb) => {
        /*const user = await getUserByName(username)
        if (user == null) {
            console.log("user null")
          return done(null, false, { message: 'No user with that username' })
        }
    
        try {
          if (password === user.password) {
            console.log("Password check worked")
            return done(null, user)
          } else {
            //console.log("user password", user.password)
            console.log("Password incorrect")
            return done(null, false, { message: 'Password incorrect' })
          }
        } catch (e) {
          return done(e)
        }*/

        const user = await getUserByName(profile.username);
        if(user == null){
            console.log("User does not exist")
            const newUser = createUser(profile.username)
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
      done(null, user.username)
  })
  passport.deserializeUser(async (user, done) => {
      return done(null, user)
  })
}

module.exports = initialize