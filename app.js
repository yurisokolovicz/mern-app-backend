const express = require('express');
const bodyParser = require('body-parser');
// Importing middlewares
const placesRoutes = require('./routes/places-routes');

const app = express();
// Express will now only forward requests to placesRoutes (middleware) if the path starts with /api/places. It can be longer than that, but it has to start with /api/places.
app.use('/api/places', placesRoutes); // => /api/places/...

// Error handling middleware function - it will be executed on request that have an error.
app.use((error, req, res, next) => {
    // if the response has already been sent
    if (res.headerSent) {
        return next(error); // we forward the error to the next middleware
    }
    res.status(error.code || 500); // Search code property in the error object. If it doesn't exist, we set the status code to 500. 500 indicates that there is a server error.
    res.json({ message: error.message || 'An unknown error occurred!' }); // Check if there is an message in the error object. If it doesn't exist, we set the message: 'An unknown error occurred!'
});

app.listen(5000);
