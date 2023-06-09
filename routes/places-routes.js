const express = require('express');

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
        return p.id === placeId; // p.id = place we are looking for. placeId = id part of our URL
    });
    res.json({ place: place });
});

// Export the router to apps.js
module.exports = router;
