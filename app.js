const express = require('express');
const bodyParser = require('body-parser');
// Importing middlewares
const placesRoutes = require('./routes/places-routes');

const app = express();
// Express will now only forward requests to placesRoutes (middleware) if the path starts with /api/places. It can be longer than that, but it has to start with /api/places.
app.use('/api/places', placesRoutes); // => /api/places/...

app.listen(5000);
