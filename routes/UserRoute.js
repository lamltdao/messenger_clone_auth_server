const express = require('express')
const router = express.Router()
const checkUserJwt = require('../middlewares/checkUserJwt')
const UserController = require('../controllers/UserController')

router.get('/', checkUserJwt, UserController.getUserByJwt)
router.get('/contact', checkUserJwt, UserController.getAllContacts)
router.post('/contact', checkUserJwt, UserController.addUserToContact)

module.exports = router