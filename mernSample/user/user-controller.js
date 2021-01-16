const httpError = require("../errorHttp")
const bcrypt = require('bcryptjs')
const User = require('./usermodel')
const jwt = require('jsonwebtoken')





const getUserlogin = async (req,res,next) =>{
    let user

    try {
        user = await User.find({}, '-password')

    } catch (err) {
        const error = new httpError('something went wrong, cannot fetch user', 500)
        return next(error)
    }

    res.json({user: user.map(user => user.toObject({getters: true}))})
}
































const login = async (req,res,next) =>{
    const { email, password} = req.body
    
    let existingUser

    try {
        existingUser = await User.findOne({email : email})
    } catch (err) {
        const error = new httpError('something went wrong, cannot login', 500)
        return next(error)
    }

    if (!existingUser ){
        const error = new httpError('wrong credentails', 401)
        return next(error)
    }

    let isValidPassword = false

    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    }catch (err) {
        const error = new httpError('wrong credentails', 500)
        return next(error)
    }

    if (!isValidPassword){
        const error = new httpError('wrong credentails', 401)
        return next(error)
    }

    let token

    try{
        token =  jwt.sign(
            {userId : existingUser.id, email : existingUser.email},
            ('unshaare_token'), 
            {expiresIn:"1h"})
    } catch (err) {
        const error =new httpError(
            "cannot sign up user", 500
        )
     return next(error)
    }
        
        res.json({message: 'logged in!' ,
         userId : existingUser.id, email : existingUser.email, token: token})
    
}

























const signUp = async (req, res, next) =>{

    const {name, email, password} = req.body

    let existingUser

    try {
        existingUser =await User.findOne({email : email})
    } catch (err) {
        const error = new httpError('cannot sign up, something went wrong', 500)
        return next(error)
    }

    if (existingUser){
        const error = new httpError('user already exist', 422)
        return next(error)
    }

    let hashPassword
    try {
        hashPassword = await bcrypt.hash(password, 12)

    } catch (err) {
        const error = new httpError('cannot sign up, something went wrong', 500)
        return next(error)
    }
 
    const createUser = new User({
        name,
        email,
        password : hashPassword,
        image : req.file.path ,
        places : []
    })

    try {
        await createUser.save()
    } catch (err) {
        const error =new httpError(
            "cannot sign up user", 500
        )
     return next(error)
    }

    let token

    try{
        token =  jwt.sign(
            {userId : createUser.id, email : createUser.email},
            ('unshaare_token'), 
            {expiresIn:"1h"})
    } catch (err) {
        const error =new httpError(
            "cannot sign up user", 500
        )
     return next(error)
    }

    res.json({userId :  createUser.id, email : createUser.email, token : token})
}

exports.signUp = signUp
exports.getUserlogin = getUserlogin
exports.login = login  
