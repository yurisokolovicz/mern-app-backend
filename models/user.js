const mongoose = require('mongoose');
// For check if the email is unique we have to install a 3rd package lib called mongoose unique validator.
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    // one user can have multiple places: use []
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }]
});

// Adding the mongoose unique validator to the userSchema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
