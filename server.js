/* eslint-disable no-console */
console.log('Starting Server......');

const express = require('express');
const app = express();
module.exports = app // for testing

// Config
const port = process.env.PORT || 3001;
console.log(`Port = ${port}`);
console.log(`NODE_ENV =${process.env.NODE_ENV}`);
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

// DB & Models:
const { User, FrequentProblem  } = require('./models')

// POST Body Parsing:
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// Authentication:
const passport = require('./passportAuthentication')
app.use(passport.initialize())

// Routs:
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/build/index.html');
});

app.get('/frequent_problem/:id', (req, res) => {
    var problemId = req.params.id;
    FrequentProblem.findById(problemId)
        .then( (problem) => res.send(problem.toJSON()))
        .catch( (error) => res.send(400))
});

app.post('/login', passport.authenticate('local'), function (req, res) {
    // res.redirect('/')
    const { firstName, lastName } = req.user
    res.status(200).send({firstName, lastName})
})


const countUsers = function () {
    return User.findAll()
        .then(function (all) {
    })
}



app.post('/signup', (req, res) => {
    return countUsers().then(function () {
        return User.create(req.body)
            .then(countUsers())
        .then( (newUser) => {
            res.sendStatus(200)
        }).catch( (e) => {
            res.status(400).send(e.errors)
        })
    })
})

// All set!
app.listen(port)
