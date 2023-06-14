const express = require('express'); // Importing express
// using express validator
const { check } = require('express-validator');
const { getPlaceById } = require('../controllers/places-controller');
const placesControllers = require('../controllers/places-controller'); // Importing controllers containing the midleware functions
const router = express.Router();

// Pointing to the midlewares
router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);
// validating the title with express validator to check if it is not empty, the description length to min 5 characters, and address to not be empty.
router.post(
    '/',
    [check('title').not().isEmpty(), check('description').isLength({ min: 5 }), check('address').not().isEmpty()],
    placesControllers.createPlace
);

router.patch('/:pid', [check('title').not().isEmpty(), check('description').isLength({ min: 5 })], placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);

// Export the router to apps.js
module.exports = router;
