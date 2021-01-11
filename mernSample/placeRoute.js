const express = require('express')
const router = express.Router()
const placeController = require('./places/places-controller')


// router.get('/:pid',placeController.getPlaceById)

router.get('/users/:uid', placeController.getPlaceByUserId)

router.post('/', placeController.createPlaces)

// router.patch('/:pid', placeController.updateplaces)

router.delete('/:pid', placeController.deletePlace)

module.exports = router 