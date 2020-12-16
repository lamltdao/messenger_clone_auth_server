const express = require('express')
const router = express.Router()
const {checkAuthenticated, checkNotAuthenticated} = require('../middlewares/checkAuth')
const AuthController = require('../controllers/AuthController')
const passport = require('passport')

router.post('/login', passport.authenticate('local', {
    // successRedirect: '/',
    // failureRedirect: '/login',
    //failureFlash: true
}), AuthController.login)

router.post('/register', AuthController.register)

router.delete('/logout', AuthController.logOut)

module.exports = router