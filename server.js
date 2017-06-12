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
const { User, FrequentProblem, Ticket, TicketUpdate  } = require('./models')

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

app.get('/frequent_problems', (req, res) => {
    FrequentProblem.findAll()
        .then( all => res.send(all.map( item => item.toJSON())))
});

app.get('/frequent_problem/:id', (req, res) => {
    var problemId = req.params.id;
    FrequentProblem.findById(problemId)
        .then( (problem) => res.send(problem.toJSON()))
        .catch( (error) => res.send(400))
});

app.post('/login', passport.authenticate('local'), function (req, res) {
    // res.redirect('/')
    const { firstName, lastName, email} = req.user
    res.status(200).send({user: {firstName, lastName, email}})
})

// TODO: don't allow unauthenticated users to do anything
// TODO: Also, don't allow a user to create tickets for other users
app.post('/ticket', (req, res) => {
    const {userId, subject, text} = req.body
    let ticketId
    Ticket.create({userId, subject})
        .then( (newTicket) => {
            ticketId = newTicket.id
            return TicketUpdate.create({
                text,
                ticketId,
                newStatus: 'open'
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

app.get('/tickets/:id', function (req, res) {
    const ticketId = req.params.id
    Ticket.findOne({
        where: {
            id: ticketId
        },
        include: [ TicketUpdate ]
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
    return User.create({email, firstName, lastName, password})
        .then( (newUser) => {
            res.status(200).send({
                user: {email, firstName, lastName}
            })
        })

        .catch( (e) => {
            res.status(400).send(e.errors)
        })
})

// All set!
app.listen(port)
