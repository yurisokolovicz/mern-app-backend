// In the routes file I will set up the middleware that is responsible for handling routes related to places.
const express = require('express');

const HttpError = require('./../models/http-error');

const router = express.Router();
// It will later be replaced by a database
const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
            lat: 40.7484474,
            lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
];
// Midleware function
// Here we only add the path after that initial filter (/api/places) that is located in the app.js. So we can remove it from here.
router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid; // { pid: 'p1' }
    // find method helps us to find a specific element in an array
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId; // p.id = id of the place we are looking for. placeId = id part of our URL
    });
    if (!place) {
        // trigger an error
        throw new HttpError('Could not find a place for the provided id.', 404);
        // throw error; // We can use throw error to throw an error in synchronous code.
    }
    // res.json({ place: place });
    res.json({ place });
});
// TODO: Write a new route for GET request that is able to accept the following dynamic uid segment: /api/places/user/u1
router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;

    const place = DUMMY_PLACES.find(p => {
        return p.creator === userId;
    });
    if (!place) {
        return next(new HttpError('Could not find a place for the provided uid.', 404)); // We can use next() to forward the error to the next middleware. next is used in async code.
    }
    res.json({ place });
});

// Export the router to apps.js
module.exports = router;
