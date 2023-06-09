const express = require('express'); // Importing express
const { getPlaceById } = require('../controllers/places-controller');
const placesControllers = require('../controllers/places-controller'); // Importing controllers containing the midleware functions
const router = express.Router();

// Pointing to the midlewares
router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlaceByUserId);

// Export the router to apps.js
module.exports = router;
