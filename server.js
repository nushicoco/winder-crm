/* eslint-disable no-console */
console.log('Starting Server......');

// Config
require('dotenv-safe').load(); // Load env vars from ./.env
console.log(`NODE_ENV =${process.env.NODE_ENV}`);
const port = process.env.PORT;
console.log(`Port = ${port}`);

const express = require('express');
const app = express();
module.exports = app; // for testing

// POST Body Parsing:
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Session
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

// Routes:
app.use(express.static('client/build'));
require('./routes')(app, passport, __dirname)

// All set!
app.listen(port);
