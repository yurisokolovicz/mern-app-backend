const express = require('express'); // Importing express
const { check } = require('express-validator');
const { getPlaceById } = require('../controllers/places-controller');
const userController = require('../controllers/users-controller'); // Importing controllers containing the midleware functions
const router = express.Router();

// Pointing to the midlewares
router.get('/', userController.getUsers);
// normalizeEmail convert Test@test.com in test@test.com
router.post(
    '/signup',
    [check('name').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({ min: 6 })],
    userController.signup
);

router.post('/login', userController.login);

// Export the router to apps.js
module.exports = router;
