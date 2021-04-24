const bcrypt = require('bcrypt')
const User = require('../models/User')
const RefreshToken = require('../models/RefreshToken')
const jwt = require('jsonwebtoken')

const jwtExpiredIn = 60*60

module.exports = {
    login: async(req, res) => {
        try {   
            const {id, role} = req.user
            // sign jwt
            const jwtBody = {userId: id, role}
            const accessToken = jwt.sign(jwtBody, process.env.ACCESS_TOKEN_SECRET, {expiresIn: jwtExpiredIn})
            const refreshToken = jwt.sign(jwtBody, process.env.REFRESH_TOKEN_SECRET)
            // Store refreshToken in db
            let token = new RefreshToken({refreshToken})
            await token.save()
            return res.status(200).json({accessToken, refreshToken})
        }
        catch {
            return res.sendStatus(500)
        }
    },
    register: async (req,res) => {
        try {            
            const {name, email, password} = req.body
            const existingUser = await User.find({email})
            if(existingUser.length > 0) return res.status(409).json('Email already used')
            const hashPassword = await bcrypt.hash(password, 10)         
            const user = new User({name, email, password: hashPassword, role:'normal'})
            await user.save()
            return res.status(200).json({message: 'Successfully register'})
        }
        catch(err) {
            console.log(err);
            return res.status(500).json('Internal error')
        }   
    },
    logOut: async(req,res) => {
        let refreshToken
        try {
            refreshToken = await RefreshToken.findOne({refreshToken: req.body.refreshToken})
            if(refreshToken == null) {
                return res.sendStatus(404)
            }
            await refreshToken.remove()
            req.logOut() // passport func
            return res.sendStatus(204)
        }
        catch {
            return res.sendStatus(500)
        }
        
    },
    generateNewAccessToken: async (req,res) => {
        try {
            // check if there is refresh token
            const {refreshToken} = req.body

            if(refreshToken == null) return res.sendStatus(401)
            
            // check if refreshToken already in db. if yes, cannot generate new access token 
            let token = await RefreshToken.findOne({refreshToken})
            if(token == null) {
                return res.sendStatus(403)
            }
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,payload) => {
                if(err) return res.sendStatus(403)
                // if yes, then generate new access token
                payload.iat = Date.now()
                const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: jwtExpiredIn})
                return res.json({accessToken})
            })        
        }
        catch {
            return res.sendStatus(500)
        }

    }
}