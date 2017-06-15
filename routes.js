module.exports = function (app, passport) {
    const { User, FrequentProblem, Ticket, TicketUpdate  } = require('./models')

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/client/build/index.html');
    });


    //// AUTHENTICATION \\\\

    app.get('/user', (req, res) => {
        if (!req.user) {
            return res.status(400).send()
        }
        const {email, firstName, lastName, isSuperuser} = req.user
        return res.status(200).send({email,firstName, lastName, isSuperuser})
    })

    app.post('/login', passport.authenticate('local'), function (req, res) {
        if (!req.user) {
            return res.status(400)
        }
        const { firstName, lastName, email, isSuperuser} = req.user;
        return res.status(200).send({user: {firstName, lastName, email, isSuperuser}})
    });

    app.post('/logout', (req, res) => {
        req.logout()
        res.redirect('/')
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
                console.log(e)
                res.status(400).send(e.errors);
            })
    })





    //// FREQUENT PROBLEMS \\\\\

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





    //// TICKETS \\\\

    app.post('/ticket', (req, res) => {
        if (!req.user) {
            res.status(400).send()
            return
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
        if (!req.user) {
            res.status(400).send()
            return
        }

        const {ticketId, text} = req.body
        const userId = req.user.id
        Ticket.findById(ticketId).then( (ticket) => {
            if (! (ticket.userId === req.user.id || req.user.isSuperuser) ) {
                throw 'invalid user'
            }
            return TicketUpdate.create({
                ticketId,
                text,
                userId
            })
        })
            .then( () => {
                res.status(200).send()
            })
            .catch( (error) => {
                res.status(400).send()
            })
    })

    app.get('/tickets/:id', function (req, res) {
        if (!req.user) {
            res.status(400).send()
            return
        }

        const ticketId = req.params.id
        Ticket.findOne({
            where: {
                id: ticketId
            },
            include: [{all: true, nested: true}],
            order: [[TicketUpdate, 'createdAt', 'DESC']]
        })
            .then( (ticket) => {
                if (ticket.userId === req.user.id || req.user.isSuperuse) {
                    res.status(200).send(ticket.toJSON())
                }
                else {
                    res.status(400).send()
                }
                return
            })
            .catch ( (error) => {
                console.error(error)
                res.sendStatus(400)
            })
    })

    app.get('/tickets', (req, res) => {
        if (!(req.user && req.user.isSuperuser)) {
            res.status(400).send()
            return
        }

        Ticket.findAll({include: [TicketUpdate, User]})
            .then(function (tickets) {
                res.status(200).send(tickets.map( ticket => ticket.toJSON()))
            })

            .catch( (error) => {
                console.error(error)
                throw error
            })
    })

    // todo check on production ,currently not sure how to check..
    app.get('*', (req,res) => {
        res.sendFile(__dirname + '/client/build/index.html');
    })
}
