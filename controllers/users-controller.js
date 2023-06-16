const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Yuri Andrade',
        email: 'test@test.com',
        password: '123456'
    }
];

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }
    const { name, email, password, places } = req.body;

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
        places
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

const login = (req, res, next) => {
    const { email, password } = req.body;
    // Find in dummy_users an email property which holds a value equal to the email from the request body.
    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identify user, credentials seem to be wrong', 401);
    }

    res.json({ message: 'Logged in!' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
