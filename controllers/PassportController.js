const User = require("../models/User")
const bcrypt = require('bcrypt')

module.exports = {
    localAuthenticateUser: async (email, password, cb) => {
        try {
            const user = await User.findOne({email})
            if(user == null) {
                return cb(null, false, {message: 'No user with that email'})
            }
            if(await bcrypt.compare(password, user.password)) {
                return cb(null, user)
            }
            else {
                return cb(null, false, {message: 'Password incorrect'})
            }
        }
        catch (error){
            return cb(e)
        }
    }
}