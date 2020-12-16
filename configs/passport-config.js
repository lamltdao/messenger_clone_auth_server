const LocalStrategy = require('passport-local').Strategy
const PassportController = require('../controllers/PassportController')
const User = require('../models/User')

const passportConfig = (passport) => {
    // Strategy
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
        PassportController.localAuthenticateUser
    ))
    // Sessions
    passport.serializeUser((user, cb) => {
        cb(null,user._id)
    })
    passport.deserializeUser((id, cb) => {
        User.findById(id, (err, user) => {
            cb(err, user)
        })
    })
}

module.exports = passportConfig