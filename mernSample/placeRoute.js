const express = require('express')
const router = express.Router()
const placeController = require('./places/places-controller')
const fileUpload = require('../middleware/file-upload')
const checkAuth = require('../middleware/check-auth')

router.get('/:pid',placeController.getPlaceById)

router.get('/users/:uid', placeController.getPlaceByUserId)

router.use(checkAuth)

router.post('/',fileUpload.single('image'), placeController.createPlaces)

router.patch('/:pid', placeController.updateplaces)

router.delete('/:pid', placeController.deletePlace)

module.exports = router  