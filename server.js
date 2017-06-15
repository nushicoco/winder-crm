/* eslint-disable no-console */
console.log('Starting Server......');
require('dotenv-safe').load(); // Load env vars from ./.env

const express = require('express');
const app = express();
module.exports = app; // for testing

// Config
const port = process.env.PORT;
console.log(`Port = ${port}`);
console.log(`NODE_ENV =${process.env.NODE_ENV}`);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

// DB & Models:
// require('./models')

// POST Body Parsing:
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const expressSession = require('express-session')
app.use(expressSession({
    name: 'winder-session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
}));

// Authentication:
const passport = require("./passportAuthentication");
app.use(passport.initialize());
app.use(passport.session());

// Routs:
require('./routes.js')(app, passport)

// All set!
app.listen(port);
