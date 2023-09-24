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
            clientID: 'f727b63081b994b4ba6d',
            clientSecret: '0fec7e745d07c10ef724d5b9e89b578903aa0041',
            callbackURL: "http://localhost:3000/auth/github/callback"
        },



    /*new LocalStrategy({ usernameField: 'username' },*/ authenticateUser))
    passport.serializeUser((user, done) => {
        console.log("serializeID", user.username);
        done(null, user.username)
    })
    passport.deserializeUser(async (user, done) => {
        console.log("deserialize name", user)
        const user1 = await getUserByName(user)
        console.log("deserialize", user1)
        return done(null, user1)
    })
}

module.exports = initialize