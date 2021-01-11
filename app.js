const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 4000
const HttpError = require('./mernSample/errorHttp')
const mongoose  = require('mongoose')

const placeRouter = require('./mernSample/placeRoute')
const user = require('./mernSample/userRoute')




app.use(bodyParser.json())

app.use('/api/places', placeRouter)
app.use('/api/users', user)

app.use((req,res,next)=>{
    const error =  new HttpError('route cannot be found', 404)
   return next(error);
})

app.use((error, req, res, next)=>{
if (res.headerSent){
    return next(error)
}
res.status(error.code || 500);
res.json({message: error.message || 'an unkwon error occured!'})
})




mongoose
// .connect('mongodb+srv://golden:olaadura123@cluster0.lryys.mongodb.net/merntutorial?retryWrites=true&w=majority')
.connect('mongodb+srv://dangolden:olaadura123@cluster0.lryys.mongodb.net/places?retryWrites=true&w=majority')
.then(()=>{
   app.listen(port , ()=>{
       console.log(`port ${port} is running perfectly fine`)
   })
})
.catch((err)=>{
    console.log(err)
})


// sess = await mongoose.startSession();
    // sess.startTransaction();
    // await createdPlace.save({session : sess});
    // user.places.push(createdPlace);
    // await user.save({session : sess});
    // await sess.commitTransaction();

    // let user

// try {
//     user = await User.findById(creator)
    
// } catch (err) {
//     const error = new httpError('user id cannot be found', 500)
//     return next(error)
// }

// if (!user){
//     const error = new httpError('user  cannot be found', 500)
//     return next(error)
// }

// console.log(user)

