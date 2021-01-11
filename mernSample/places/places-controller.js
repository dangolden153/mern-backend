const httpError = require('../errorHttp')
const Place = require('./placeModel')
const User = require('../user/usermodel')
const  mongoose  = require('mongoose')




const getPlaceById = async (req, res, next)=>{
    const placeid = req.params.pid

    let place 

    try{
        place = await Place.findById(placeid)
    }catch (err){
        const error = new httpError('place cannot by found', 500)
        return next(error)
    }

    if (!place || place.length === 0){
        return next(new httpError('this user place is invalid!', 404) )
    }
    res.json({place: place.toObject({getters: true}) })

}







const getPlaceByUserId = async (req, res, next)=>{
    const userId = req.params.uid

    let useWithPlace 

    try {
        useWithPlace = await User.findById(userId).populate('places')
    } catch (err) {
        const error = new httpError('user place cannot be found, try again', 500)
        return next(error)
    }

    if (!useWithPlace || useWithPlace.places.length === 0){
        const error = new httpError('this user place is invalid!', 404)
        return next(error)
    }
res.json({places : useWithPlace.places.map(place => place.toObject({getters:true}))})
}









const deletePlace = async (req,res,next) =>{
    const placeId = req.params.pid
    
    let place

    try {
        place =await Place.findById(placeId).populate('creator')

    } catch (err) {
        const error = new httpError('something went wrong, place cannot by deleted', 500)
        return next(error)
    }

    if(!place){
        const error = new httpError('cannot found a place for this user ', 500)
        return next(error)
    }
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.remove({session : sess});
        place.creator.places.pull(place);
        await place.creator.save({session : sess})
        await sess.commitTransaction()
         
    } catch (err) {
        const error = new httpError('something went wrong, place cannot by deleted', 500)
        return next(error)
    }

    res.status(200).json({message : 'place deleted!'})
}





const createPlaces = async (req, res, next) =>{

    const {title, description, creator} = req.body

    let user
    try {
        user = await User.findById(creator)
    } catch (err) {
        const error =new httpError(
            "creating place failed", 500
        )
            return next(error)
    }
       
    if (!user){
            const error =new httpError(
                "could not find user for the provided", 500
            )
             return next(error)
       }
   
    const createAplace = new  Place({
        title, 
        description, 
        creator
    })

    try {
        const sess =await mongoose.startSession();
        sess.startTransaction();
        await createAplace.save({session : sess});
        user.places.push(createAplace)
        await user.save({session : sess})
        await sess.commitTransaction()

    } catch (err) {
        const error =new httpError(
            'place cannot be created', 500
        )
        return next(error)
        
    }


    res.json({place : createAplace})
}




exports.createPlaces = createPlaces
exports.getPlaceByUserId = getPlaceByUserId
exports.deletePlace = deletePlace
exports.getPlaceById = getPlaceById















// const updateplaces = async (req,res,next)=>{
//     const {title,desciption} = req.body
//     const placeid = req.params.pid

//     let place

//     try {
//         place = await place.findById(placeid)    
//     } catch (err) {
//         const error = new httpError('something went wrong, place cannot be updated', 500)
//         return next(error)

//     }

//     place.title =title,
//     place.desciption = desciption

//     try {
//         place.save()
//     } catch (err) {
//         const error = new httpError('something went wrong, place cannot be updated', 500)
//         return next(error)
//     }
    

//      res.status(201).json({place : place.toObject({getters : true})})
// }

// exports.updateplaces = updateplaces
