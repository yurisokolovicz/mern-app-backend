// In the Controller we have only the Midleware function, we don`t need to import Express!
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('./../models/http-error');

// It will later be replaced by a database
let DUMMY_PLACES = [
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

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid; // Data comes from URL.

    const places = DUMMY_PLACES.filter(p => {
        return p.creator === userId;
    });
    if (!places || places.length === 0) {
        return next(new HttpError('Could not find places for the provided uid.', 404)); // We can use next() to forward the error to the next middleware. next is used in async code.
    }
    res.json({ places });
};
// Midleware for create place at /api/places/
// We encode data in the post request body (get request does not have request body - there is no data in the body)
// For a POST request the data is in the body of the Post request.
// To get the data out of the body we can use the bodyParser package.
const createPlace = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data', 422);
    }
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
// Patch request we have a request body.
// The id we need for patch request is encoded in the URL
const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed, please check your data', 422);
    }
    const { title, description } = req.body;
    const placeId = req.params.pid; // its pid in the router

    const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) };
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace;
    // Not 201 because we did not created any thing new, just changed something.
    res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
    // 1st = extract the id of the url
    const placeId = req.params.pid; // because it is pid in the routes file.
    if (!DUMMY_PLACES.find(p => p.id === placeId)) {
        throw new HttpError('Could not find a place for that id', 404);
    }
    // All objects with ID other than placeId will be kept in the DUMMY_PLACES array, excluding the place with the corresponding ID.
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);
    res.status(200).json({ message: 'Deleted place' });
};

// module.exports: only for single exports
//// For more than 1 export we use a pointer to the function
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
