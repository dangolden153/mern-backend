const httpError = require("../errorHttp")

const User = require('./usermodel')




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

    if (!existingUser || existingUser.password !== password){
        const error = new httpError('wrong credentails', 401)
        return next(error)
    }
        
        res.json({message: 'logged in!'})
    
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

    const createUser = new User({
        name,
        email,
        password,
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

    res.json({user : createUser})
}

exports.signUp = signUp
exports.getUserlogin = getUserlogin
exports.login = login
