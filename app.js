const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Importing middlewares
const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();
// Express will now only forward requests to placesRoutes (middleware) if the path starts with /api/places. It can be longer than that, but it has to start with /api/places.

// It will parse any incoming request body and extract any JSON data there, convert to regular javascript data structures like objects and arrays and then call next automatically so we reach the next midleware in line and then also add this JSON data there.
app.use(bodyParser.json());

app.use('/api/places', placesRoutes); // => /api/places/...
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error; // It is sync code
});

// Error handling middleware function - it will be executed on request that have an error.
app.use((error, req, res, next) => {
    // if the response has already been sent
    if (res.headerSent) {
        return next(error); // we forward the error to the next middleware
    }
    res.status(error.code || 500); // Search code property in the error object. If it doesn't exist, we set the status code to 500. 500 indicates that there is a server error.
    res.json({ message: error.message || 'An unknown error occurred!' }); // Check if there is an message in the error object. If it doesn't exist, we set the message: 'An unknown error occurred!'
});

mongoose
    .connect('mongodb+srv://yuri:qLLJkQ3EMDNuN4T2@cluster0.rmn8q1d.mongodb.net/places?retryWrites=true&w=majority')
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });
