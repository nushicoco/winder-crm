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
const { User, FrequentProblem, Ticket, TicketUpdate  } = require('./models')

// POST Body Parsing:
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const expressSession = require('express-session')
app.use(expressSession({
    name: 'winder-session',
    secret: 'random_string_goes_here',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

// Authentication:
const passport = require("./passportAuthentication");
app.use(passport.initialize());
app.use(passport.session());

// Routs:
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/build/index.html');
});

app.get('/frequent_problems', (req, res) => {
    FrequentProblem.findAll()
        .then( all => res.send(all.map( item => item.toJSON())))
});

app.get('/frequent_problem/:id', (req, res) => {
    let problemId = req.params.id;
    FrequentProblem.findById(problemId)
        .then( (problem) => res.send(problem.toJSON()))
        .catch( (error) => res.send(400))
});

app.get('/user', (req, res) => {
    if (!req.user) {
        return res.status(400).send()
    }
    const {email, firstName, lastName} = req.user
    return res.status(200).send({email,firstName, lastName})
})

app.post('/login', passport.authenticate('local'), function (req, res) {
    if (!req.user) {
        return res.status(400)
    }
    const { firstName, lastName, email, isSuperuser} = req.user;
    return res.status(200).send({user: {firstName, lastName, email, isSuperuser}})
});

app.post('/ticket', (req, res) => {
    if (!req.user) {
        return res.status(400).send()
    }
    const { subject, text} = req.body
    let userId = req.user.id
    let ticketId

    Ticket.create({
        status: 'open',
        userId,
        subject
    })
        .then( (newTicket) => {
            ticketId = newTicket.id
            return TicketUpdate.create({
                text,
                ticketId,
                userId
            })})
        .then( (ticketUpdate) => {
            return Ticket.findOne(
                {where: {id: ticketId},
                include: TicketUpdate}
            )
        })
        .then( (ticket) => {
            res.status(200).send(ticket.toJSON())
        })

        .catch( (error) => {
            console.error(error)
            throw error
        })
})

app.post('/update_ticket', (req, res) => {
    const {ticketId, text} = req.body
    let userId = 1 // TODO Remove and use authenticated user
    TicketUpdate.create({
        ticketId,
        text,
        userId
    })
        .then( () => {
            res.status(200).send()
        })
})

app.get('/tickets/:id', function (req, res) {
    const ticketId = req.params.id
    Ticket.findOne({
        where: {
            id: ticketId
        },
        include: [{all: true, nested: true}],
        order: [[TicketUpdate, 'createdAt', 'DESC']]
    })
        .then( (ticket) => {
            res.status(200).send(ticket.toJSON())
        })
        .catch ( (error) => {
            console.error(error)
            res.sendStatus(400)
        })
})

// TODO superuser authentication...
app.get('/tickets', (req, res) => {
    Ticket.findAll({include: [TicketUpdate, User]})
        .then(function (tickets) {
            res.status(200).send(tickets.map( ticket => ticket.toJSON()))
        })

        .catch( (error) => {
            console.error(error)
            throw error
        })
})

app.post('/signup', (req, res) => {
    let {email, firstName, lastName, password} = req.body
    return User.create({email: email.toLowerCase(), firstName, lastName, password})
        .then( (newUser) => {
            req.login(newUser, function (error) {
                if (error) {
                    res.status(400).send()
                }
                res.status(200).send({
                    user: {email, firstName, lastName}
                })
            })
        }).catch( (e) => {
            res.status(400).send(e.errors);
        })
})

// All set!
app.listen(port);
