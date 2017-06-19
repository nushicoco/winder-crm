require('./support/env.js')
const { User, Ticket, TicketUpdate } = require('../models')

const chai = require('chai')
const expect = chai.expect
chai.should()
chai.use(require('chai-http'))
chai.use(require('chai-arrays'))

const app = require('../server')

let goodGuyGreg
const gggPassword = 'conference'

const makeGreg = function () {
    return User.sync({force: true})
        .then(function () {
            return User.create({
                firstName: 'greg',
                lastName:  'goodguy',
                password:  gggPassword,
                isSuperuser: true,
                email:     'goodguygreg@deer.com'
            })
        })
        .then(function (ggg) {
            goodGuyGreg = ggg
        })
}

const clearTickets = function () {
    return Promise.all([
        Ticket.sync({force: true}),
        TicketUpdate.sync({force: true})
    ])
}

describe('Ticket model', function () {
    beforeEach(makeGreg)

    beforeEach(clearTickets)

    it('should be created and query without errors', function () {
        return Ticket.create({
            userId: goodGuyGreg.id,
            subject: 'issues with floppy disk drive'
        })
            .then(function (ticket) {
                return ticket.getUser()
            })

            .then(function (user) {
                user.firstName.should.be.equal(goodGuyGreg.firstName)

            })
    })

    it('should be possible to get all tickets belogning to a user', function () {
        const ticketSubjects = ['first!11', 'sound too bright', 'picture too loud', 'global cooling']
        const userId = goodGuyGreg.id
        const promises = ticketSubjects.map( subject => Ticket.create({userId, subject}))
        return Promise.all(promises)
            .then(function () {
                return Ticket.findAll({where: {userId: goodGuyGreg.id}})
            })

            .then(function (tickets) {
                tickets.should.have.lengthOf(4)
                expect(ticketSubjects).to.be.containing(tickets[0].subject)
            })
    })

    it('should be possible to retreive ticketUpdates belonging to a Ticket', function () {
        let ticketId
        return Ticket.create({
            userId: goodGuyGreg.id,
            subject: 'great sbject'
        })
            .then( function (ticket) {
                ticketId = ticket.id
                return TicketUpdate.create({
                    ticketId,
                    text: 'great text'
                })
            })
            .then(function () {
                return Ticket.findOne( {
                    where: {
                        id: ticketId
                    },
                    include: TicketUpdate
                })
            })
            .then(function (ticket) {
                expect(ticket).to.have.property('ticket_updates')
                expect(ticket.ticket_updates).to.have.lengthOf(1)
                expect(ticket.ticket_updates[0]).to.have.property('text')
                expect(ticket.ticket_updates[0].text).to.equal('great text')
            })
    })
})

describe('GET /tickets', function () {
    beforeEach(makeGreg)
    beforeEach(clearTickets)
    it('should list all available tickets', function () {

        const agent = chai.request.agent(app)

        // Create tickets:
        const userId = goodGuyGreg.id
        const tickets = [
             ['ticket1 subject', 'ticket1 text'],
             ['ticket2 subject', 'ticket2 text'],
             ['ticket3 subject', 'ticket3 text'],
        ]
        return Promise.all(tickets.map( ([subject, text]) => { return Ticket.create({userId, subject}) }))

        // Receive them:
            .then(function () {
                return agent.post('/login').send({email: goodGuyGreg.email, password: gggPassword})
            })
            .then(function () {
                return agent.get('/tickets').send()
            })
            .then(function (response) {
                expect(response.status).to.equal(200)
                expect(response.body).to.be.a('array')
                expect(response.body).to.have.lengthOf(3)
            })
    })

})

describe('POST /ticket', function () {
    beforeEach(makeGreg)
    beforeEach(clearTickets)

    it('should allow creating a ticket for logged-in user', function () {
        const agent = chai.request.agent(app)

        //login:
        const creds = {
                email: goodGuyGreg.email,
                password: gggPassword
        }
        return agent.post('/login').send(creds)

        // Create ticket:
            .then(function (response) {
                expect(response.status).to.equal(200)
                return agent.post('/ticket')
                    .send({
                        subject: 'I have problem',
                        text: 'Speakers do not show yellow or purple'
                    })
            })

        // Check response
            .then(function (response) {
                response.status.should.equal(200)
                return Ticket.all()
            })

        // Check Database:
            .then(function (allTickets) {
                allTickets.should.have.lengthOf(1)
                const ticket = allTickets[0]
                expect(ticket).to.include({
                    userId: goodGuyGreg.id,
                    subject: 'I have problem'
                })
                // TODO check the ticket's TicketUpdate array somehow
            })
            .catch( (e) => {console.error(e); throw e})
    })

    it('/ticket:id should not work without login', function (done) {
        const agent = chai.request.agent(app)
        let ticketId
        Ticket.create({
            userId: goodGuyGreg.id,
            subject: 'problem with toaster'
        })
            .then(function (ticket) {
                ticketId = ticket.id
                TicketUpdate.create({
                    ticketId,
                    text: 'does no say lechayim'
                })

                    .then(function () {
                        agent.get(`/tickets/${ticketId}`)
                            .send()
                            .end(function (error, response) {
                                expect(response.status).to.equal(401)
                                done()

                            })
                    })
            })
    })

    it('/tickets/:id should return ticket information', function (done) {
        const agent = chai.request.agent(app)

        let ticketId
        Ticket.create({
            userId: goodGuyGreg.id,
            subject: 'problem with toaster'
        })

            .then(function (ticket) {
                ticketId = ticket.id
                TicketUpdate.create({
                    ticketId,
                    text: 'does no say lechayim'
                })
            })

            .then(function() {
                agent.post('/login').send({
                    email: goodGuyGreg.email,
                    password: gggPassword
                })
                    .end(function (error, response) {
                        response.status.should.equal(200)
                        agent.get(`/tickets/${ticketId}`)
                            .send()
                            .end(function (error, response) {
                                expect(response.status).to.equal(200)
                                const ticket = response.body
                                expect(ticket).to.include({
                                    userId: goodGuyGreg.id,
                                    subject: 'problem with toaster'
                                })
                                expect(ticket).to.have.property('ticket_updates')
                                expect(ticket.ticket_updates).to.have.lengthOf(1)
                                expect(ticket.ticket_updates[0]).to.have.property('text', 'does no say lechayim')
                                expect(ticket).to.have.property('user')
                                done()
                            })
                    })
            })

            .catch( (e) => {console.error(e); throw e})
    })
})
