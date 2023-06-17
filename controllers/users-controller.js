const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

// Send a request that returns all the users stored in db
const getUsers = async (req, res, next) => {
    // users = User.find({}, 'email name'); it is the same:

    let users;
    try {
        // returns all user object information except password
        users = await User.find({}, '-password');
        // users = User.find({}, 'email name'); it is the same:
    } catch (err) {
        const error = new HttpError('Fetching users failed, please try again later', 500);
        return next(error);
    }
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }
    const { name, email, password } = req.body;
    // email validation
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Sign up failed, please try again later', 500);
        return next(error);
    }
    // If we have existingUser
    if (existingUser) {
        const error = new HttpError('User exists already, please login instead', 422);
        return next(error);
    }

    // Later in the authentication we will encrypt the password, the way we did here it is not secure (store not encrypted password)
    const createdUser = new User({
        name,
        email,
        image: 'https://images.unsplash.com/photo-1686772939025-20195731d9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
        password,
        places: []
    });
    // Saving the user
    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error);
    }
    // converting mongoose object to default javascript object.
    // getters: true, remove the _ from _id
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    // email validation
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Logging in failed, please try again later', 500);
        return next(error);
    }
    // check if email and password is correct
    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError('Invalid credentials, could not log you in', 401);
        return next(error);
    }

    res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
