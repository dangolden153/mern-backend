const fs = require('fs')
const path = require('path')


const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 5000
const HttpError = require('./mernSample/errorHttp')
const mongoose  = require('mongoose')

const placeRouter = require('./mernSample/placeRoute')
const user = require('./mernSample/userRoute')
const cors = require('cors')


// app.use((req,res,next)=>{
//     res.setHeader("Access-Control-Allow-Origin", '*')
//     res.setHeader("Access-Control-Allow-Headers",
//      'Origin, X-Requested-With, Content-Type, Accept, Authorization')
//      res.setHeader("Access-Control-Allow-Headers", 'GET, POST, PATCH, DELETE')
    
//     next();
//     })
    

    app.use(bodyParser.json())
    app.use(cors()) 
app.use('/uploads/images', express.static(path.join("uploads", "images")))


app.use('/api/places', placeRouter)
app.use('/api/users', user) 



app.use((req,res,next)=>{
    const error =  new HttpError('route cannot be found', 404)
   return next(error);
})

app.use((error, req, res, next)=>{
    if (req.file){
        fs.unlink(req.file.path,  err=>{
            console.log(err)
        })
    }

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
