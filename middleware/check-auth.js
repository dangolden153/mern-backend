const HttpError = require('../mernSample/errorHttp')

const jwt = require('jsonwebtoken')

module.exports = (req, res,next)=>{

    // if (req.method === 'POST' || req.method === 'OPTIONS'){

    // next()
    // } 

    try {
    const token = req.headers.authorization.split(' ')[1];
    if(!token){

        const error = new HttpError('Authentication failed')
        return next(error)
    }    

  const decodedToken =  jwt.verify(token, 'unshaare_token')
  req.userData = {userId : decodedToken.userId}
  next()
  
  } catch (err) {
        const error = new HttpError('Authentication failed', 401)
        return next(error)
    }
} 