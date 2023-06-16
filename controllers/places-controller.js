// In the Controller we have only the Midleware function, we don`t need to import Express!
const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('./../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

// // It will later be replaced by a database
// let DUMMY_PLACES = [
//     {
//         id: 'p1',
//         title: 'Empire State Building',
//         description: 'One of the most famous sky scrapers in the world!',
//         location: {
//             lat: 40.7484474,
//             lng: -73.9871516
//         },
//         address: '20 W 34th St, New York, NY 10001',
//         creator: 'u1'
//     }
// ];

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid; // { pid: 'p1' }
    // Mongoose setup
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a place', 500);
        // stop code execution if we have error
        return next(error);
    }

    if (!place) {
        const error = new HttpError('Could not find a place for the provided id.', 404);
        // stop code execution if we have error
        return next(error);
    }
    // getters to remove _ from _id. Remove the underscore
    res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid; // Data comes from URL.
    // Mongoose setup
    let places;
    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        const error = new HttpError('Fetching places failed, please try again later', 500);
        return next(error);
    }

    if (!places || places.length === 0) {
        const error = new HttpError('Could not find places for the provided uid.', 404);
        return next(error);
    }

    res.json({ places: places.map(place => place.toObject({ getters: true })) });
};
// Midleware for create place at /api/places/
// We encode data in the post request body (get request does not have request body - there is no data in the body)
// For a POST request the data is in the body of the Post request.
// To get the data out of the body we can use the bodyParser package.
const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }
    // We use object destructuring to get different properties out of the request body and store it in constant which are then available in function.
    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    }

    // Mongoose setup
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://images.unsplash.com/photo-1666919643134-d97687c1826c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80',
        creator
    });
    try {
        await createdPlace.save();
    } catch (err) {
        const error = new HttpError('Creating place failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json({ place: createdPlace }); // 201 if something was successfully created on the server.
};
// Patch request we have a request body.
// The id we need for patch request is encoded in the URL
const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }
    const { title, description } = req.body;
    const placeId = req.params.pid; // its pid in the router

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update place', 500);
        return next(error);
    }

    place.title = title;
    place.description = description;
    // store the data changes in the db
    try {
        await place.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update place', 500);
        return next(error);
    }

    // Not 201 because we did not created any thing new, just changed something.
    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
    // 1st = extract the id of the url
    const placeId = req.params.pid; // because it is pid in the routes file.
    // defining the place
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete place', 500);
        return next(error);
    }
    // deleting from db
    try {
        await place.deleteOne();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete place', 500);
        return next(error);
    }

    res.status(200).json({ message: 'Deleted place' });
};

// module.exports: only for single exports
//// For more than 1 export we use a pointer to the function
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
