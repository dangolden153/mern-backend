const express = require('express')
const router = express.Router()
const User = require('./user/user-controller')

router.get('/',  User.getUserlogin)

router.post('/signup', User.signUp)

router.post('/login', User.login)

module.exports = router