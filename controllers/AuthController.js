const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = {
    login: async(req, res) => {
        try {   
            res.status(200).json(req.user)
        }
        catch {
            res.status(500).json('Error Logging in')
        }
    },
    register: async (req,res) => {
        try {            
            const {name, email, password} = req.body
            const hashPassword = await bcrypt.hash(password, 10)         
            const user = new User({name, email, password: hashPassword, role:'normal'})
            await user.save()
            res.send('Successfully Register')
        }
        catch(err) {
            console.log(err);
            res.send('Fail to register')
        }   
    },
    logOut: (req,res) => {
        req.logOut() // passport func
    }
}