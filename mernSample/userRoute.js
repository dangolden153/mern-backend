const express = require('express')
const router = express.Router()
const Users = require('./user/user-controller')
const filesUpload = require('../middleware/file-upload')







router.get('/',  Users.getUserlogin)




//// User.signUp

router.post('/signup',filesUpload.single("image"),Users.signUp)

router.post('/login', Users.login)

module.exports = router