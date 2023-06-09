const express = require('express');

const router = express.Router();

// Midleware function
router.get('/', (req, res, next) => {
    console.log('GET Request in Places');
    res.json({ message: 'It works!' });
});

// Export the router to apps.js
module.exports = router;
