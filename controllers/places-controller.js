// In the Controller we have only the Midleware function, we don`t need to import Express!
const { v4: uuid } = require('uuid');

const HttpError = require('./../models/http-error');

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

const getPlaceById = (req, res, next) => {
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
};

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid; // Data comes from URL.

    const place = DUMMY_PLACES.find(p => {
        return p.creator === userId;
    });
    if (!place) {
        return next(new HttpError('Could not find a place for the provided uid.', 404)); // We can use next() to forward the error to the next middleware. next is used in async code.
    }
    res.json({ place });
};
// Midleware for create place at /api/places/
// We encode data in the post request body (get request does not have request body - there is no data in the body)
// For a POST request the data is in the body of the Post request.
// To get the data out of the body we can use the bodyParser package.
const createPlace = (req, res, next) => {
    // We use object destructuring to get different properties out of the request body and store it in constant which are then available in function.
    const { title, description, coordinates, address, creator } = req.body;
    // Or do const title = req.body.title for every propertie.
    const createdPlace = {
        id: uuid(),
        title: title,
        description: description,
        location: coordinates,
        address: address,
        creator: creator
    };
    // Adding to our dummy_place data
    DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)
    // Returning an object with the place property which holds the created place.
    res.status(201).json({ place: createdPlace }); // 201 if something was successfully created on the server.
};

// module.exports: only for single exports
//// For more than 1 export we use a pointer to the function
exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
