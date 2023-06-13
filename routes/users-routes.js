const express = require('express'); // Importing express
const { getPlaceById } = require('../controllers/places-controller');
const userController = require('../controllers/users-controller'); // Importing controllers containing the midleware functions
const router = express.Router();

// Pointing to the midlewares
router.get('/', userController.getUsers);

router.post('/signup', userController.signup);

router.post('/login', userController.login);

// Export the router to apps.js
module.exports = router;
