const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    // create a Id for the creator
    // ref is to stablish a connection between schemas
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});
// The convention is tu use Uppercase and singular in the model.
// Our collection will be named places.
module.exports = mongoose.model('Place', placeSchema);
