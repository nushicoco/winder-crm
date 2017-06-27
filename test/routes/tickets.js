/* global describe it beforeEach */
const chai = require('chai')
chai.use(require('chai-as-promised'))
const expect = chai.expect
chai.should()
chai.use(require('chai-http'))

const app = require('../../server')
const { User, Ticket, TicketUpdate } = require('../../models')

let goodGuyGreg, scrappy
const gggPassword = 'conference'

const makeGregAndScrappy = function () {
  return User.sync({force: true})
    .then(function () {
      return User.create({
        firstName: 'greg',
        lastName: 'goodguy',
        password: gggPassword,
        isSuperuser: true,
        email: 'goodguygreg@deer.com'
      })
    })
    .then(function (ggg) {
      goodGuyGreg = ggg
    })
    .then(function () {
      return User.create({
        firstName: 'scrappy',
        lastName: 'coco',
        password: gggPassword,
        isSuperuser: false,
        email: 'scrapptcoco@deer.com'
      })
    })
    .then(function (coco) {
      scrappy = coco
    })
}

const clearTickets = function () {
  return Promise.all([
    Ticket.sync({force: true}),
    TicketUpdate.sync({force: true})
  ])
}

describe('GET /tickets', function () {
  beforeEach(makeGregAndScrappy)
  beforeEach(clearTickets)
  it('should list all available tickets', function () {
    const agent = chai.request.agent(app)
    // Create tickets:
    const userId = scrappy.id
    const tickets = [
      ['ticket1 subject', 'ticket1 text'],
      ['ticket2 subject', 'ticket2 text'],
      ['ticket3 subject', 'ticket3 text']
    ]
    return Promise.all(tickets.map(([subject, text]) => { return Ticket.create({userId, subject}) }))

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

  it('should list all available tickets for specific user', function () {
    const agent = chai.request.agent(app)

    // Create tickets:

    const tickets = [
      ['ticket1 subject', goodGuyGreg.id],
      ['ticket2 subject', goodGuyGreg.id],
      ['ticket3 subject', scrappy.id]
    ]
    return Promise.all(tickets.map(([subject, userId]) => { return Ticket.create({userId, subject}) }))

    // Receive them:
      .then(function () {
        return agent.post('/login').send({email: scrappy.email, password: gggPassword})
      })
      .then(function () {
        return agent.get('/tickets').send()
      })
      .then(function (response) {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.a('array')
        expect(response.body).to.have.lengthOf(1)
      })
  })

  it('should throw error if no user is logged in', function () {
    const agent = chai.request.agent(app)

    return agent.get('/tickets').send()
      .then(function (response) {
        expect(response.status).to.equal(401)
      })
      .catch(function (error) {
        error.should.have.property('response')
        error.response.status.should.equal(401)
      })
  })
})

describe('POST /ticket', function () {
  beforeEach(makeGregAndScrappy)
  beforeEach(clearTickets)

  it('should allow creating a ticket and return id & access token', function () {
    const agent = chai.request.agent(app)
    let accessToken
    let ticketId

    // login:
    const creds = {
      email: goodGuyGreg.email,
      password: gggPassword
    }
    return agent.post('/login').send(creds)

    // Create ticket:
      .then(function (response) {
        response.status.should.equal(200)
        return agent.post('/ticket')
          .send({
            content: 'I have problem',
            room: '101'
          })
      })

    // Check response
      .then(function (response) {
        response.status.should.equal(200)
        expect(response).to.be.json
        ticketId = response.body.id
        expect(ticketId).to.not.be.undefined
        accessToken = response.body.accessToken
        accessToken.should.be.a('string')
        return Ticket.findAll({
          where: {
            accessToken,
            id: ticketId
          }
        })
      })

    // Check Database:
      .then(function (allTickets) {
        allTickets.should.have.lengthOf(1)
        const ticket = allTickets[0]
        expect(ticket).to.include({userId: goodGuyGreg.id})
        expect(ticket).to.have.property('details')
        expect(ticket.details).to.include({
          content: 'I have problem',
          room: '101'
        })
      })
  })
})

describe('GET /ticket/:id', function () {
  beforeEach(makeGregAndScrappy)
  beforeEach(clearTickets)

  it('should not work without superuser or access token', function (done) {
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
            agent.get(`/tickets/${ticketId}?accessToken=wildguess`)
              .send()
              .end(function (error, response) {
                expect(error.toString()).to.not.be.null
                expect(response.status).to.equal(401)
                done()
              })
          })
      })
  })

  it('should return ticket information for superuser', function (done) {
    const agent = chai.request.agent(app)

    let ticketId
    Ticket.create({
      userId: goodGuyGreg.id,
      details: {
        name: 'john',
        content: 'problem with toaster'
      }})

      .then(function (ticket) {
        ticketId = ticket.id
        TicketUpdate.create({
          ticketId,
          text: 'does no say lechayim'
        })
      })

      .then(function () {
        agent.post('/login').send({
          email: goodGuyGreg.email,
          password: gggPassword
        })
          .end(function (error, response) {
            expect(error).to.be.null
            response.status.should.equal(200)
            agent.get(`/tickets/${ticketId}`)
              .send()
              .end(function (error, response) {
                expect(error).to.be.null
                expect(response.status).to.equal(200)
                const ticket = response.body
                expect(ticket).to.include({
                  userId: goodGuyGreg.id
                })
                expect(ticket).to.have.property('details')
                expect(ticket.details).to.include({
                  name: 'john',
                  content: 'problem with toaster'
                })
                expect(ticket).to.have.property('ticket_updates')
                expect(ticket.ticket_updates).to.have.lengthOf(1)
                expect(ticket.ticket_updates[0]).to.have.property('text', 'does no say lechayim')
                expect(ticket).to.have.property('user')
                done()
              })
          })
      })

      .catch((e) => { console.error(e); throw e })
  })

  it('/tickets/:id should return ticket information for superuser', function (done) {
    const agent = chai.request.agent(app)

    let ticketId

    User.create({
      firstName: 'scrappy',
      lastName: 'coco',
      password: gggPassword,
      isSuperuser: false,
      email: 'scrappycoco@dogs-world.com'
    })
      .then(function () {
        Ticket.create({
          details: {
            name: 'done',
            content: 'kishot'
          }
        }).then(function (ticket) {
          ticketId = ticket.id
        })
      }).then(function () {
        agent.post('/login').send({
          email: goodGuyGreg.email,
          password: gggPassword
        })
          .end(function (error, response) {
                        expect(error).to.be.null

            response.status.should.equal(200)
            agent.get(`/tickets/${ticketId}`)
              .send()
              .end(function (error, response) {
                expect(error).to.be.null
                response.status.should.equal(200)
                expect(response).to.be.json
                expect(response.body.details).to.include({
                  name: 'done',
                  content: 'kishot'
                })
                done()
              })
          })
      })

      .catch((e) => { console.log(e); throw e })
  })

  it('/tickets/:id shouldn\'t return ticket information for another user', function (done) {
    const agent = chai.request.agent(app)

    let scrappy
    let ticketId

    User.create({
      firstName: 'scrappy',
      lastName: 'coco',
      password: gggPassword,
      isSuperuser: false,
      email: 'scrappycoco@dogs-world.com'
    })
      .then(function (coco) {
        scrappy = coco
      }).then(function () {
        Ticket.create({
          userId: goodGuyGreg.id,
          subject: 'can\'t fall asleep'
        }).then(function (ticket) {
          ticketId = ticket.id
        })
      }).then(function () {
        agent.post('/login').send({
          email: scrappy.email,
          password: gggPassword
        })
          .end(function (error, response) {
            expect(error).to.be.null
            response.status.should.equal(200)
            agent.get(`/tickets/${ticketId}`)
              .send()
              .end(function (error, response) {
                expect(error).to.not.be.null
                expect(401).to.equal(response.status)
                done()
              })
          })
      })

      .catch((e) => { console.log(e); throw e })
  })

  it('should return ticket information when given correct access token', function () {
    const agent = chai.request.agent(app)

    return Ticket.create({
      details: {
        name: 'done',
        content: 'kishot'
      }
    })
      .then(function (ticket) {
        return agent.get(`/tickets/${ticket.id}?accessToken=${ticket.accessToken}`)
          .send()
      })
      .then(function (response) {
        response.status.should.equal(200)
        expect(response).to.be.json
        response.should.be.json
        expect(response.body.details).to.include({
          name: 'done',
          content: 'kishot'
        })
      })
  })
})
describe('GET /admin/admins', function () {
  beforeEach(makeGregAndScrappy)

  it('should not work for regular users', function () {
    const agent = chai.request.agent(app)

    return agent.get('/admin/admins').send()
      .then(function (response) {
        expect(response.status).to.equal(401)
      })

      .catch(function (error) {
        error.should.have.property('response')
        error.response.status.should.equal(401)
      })
  })

  it('should return all admins', function () {
    const agent = chai.request.agent(app)

    User.create({
      firstName: 'bob',
      lastName: 'builder',
      password: 'bigladder',
      isSuperuser: true,
      email: 'bob@building.com'
    })

      .then(function () {
        return agent.post('/login').send({email: goodGuyGreg.email, password: gggPassword})
      })

      .then(function () {
        return agent.get('/admin/admins').send()
      })

      .then(function (admins) {
        expect(admins).to.hav.lengthOf(2)
      })
  })
})

describe.only('POST /ticket_update', function () {
  beforeEach(makeGregAndScrappy)
  const createTicketAndPostUpdate = function (ticketFields, updateFields) {
    const agent = chai.request.agent(app)
    let ticket

    // Create Ticket:
    return Ticket.create(Object.assign({
      userId: scrappy.id
    }, ticketFields))

    // Login:
      .then(function (newTicket) {
        ticket = newTicket
        return agent.post('/login').send({email: goodGuyGreg.email, password: gggPassword})
      })

    // Post:
      .then(function () {
        return agent.post('/update_ticket').send(Object.assign({
          ticketId: ticket.id
        }, updateFields))
      })

    // Check Response:
      .then(function (response) {
        response.status.should.equal(200)

        // Find ticket
        return Ticket.findOne({
          where: {id: ticket.id},
          include: [{all: true, nested: true}]
        })
      })
      .then(function (ticket) {
        expect(ticket.ticket_updates).to.have.lengthOf(1)
        return {ticket, ticketUpdate: ticket.ticket_updates[0]}
      })
  }

  it('should not work for regular users', function () {
    const agent = chai.request.agent(app)
    let ticket
    return Ticket.create({
      subject: 'Tofu is fat',
      userId: scrappy.id
    })

      .then(function (newTicket) {
        ticket = newTicket
        return agent.post('/login').send({email: scrappy.email, password: gggPassword})
      })

      .then(function () {
        const response = agent.post('/update_ticket').send({
          ticketId: ticket.id,
          text: 'yes Tofu is a very fatty food'
        })
        return expect(response).to.be.rejectedWith(/unauthorized/i)
      })
  })

  it('should create a ticket update with just text', function () {
    const ticketFields = {}
    const updateFields = {
      text: 'my ticket is updated'
    }

    return createTicketAndPostUpdate(ticketFields, updateFields)
      .then(function ({ticket, ticketUpdate}) {
        expect(ticketUpdate.text).to.equal('my ticket is updated')
      })
  })

  it('should create a ticket update with assigned user', function () {
    const ticketFields = {}
    const updateFields = {
      details: {
        assigneeId: 7
      }
    }

    return createTicketAndPostUpdate(ticketFields, updateFields)
      .then(function ({ticket, ticketUpdate}) {
        expect(ticketUpdate.details).to.include({
          assigneeId: 7
        })
      })
  })

  it('should create a ticket update with text + assigned user that changes the status', function () {
    const ticketFields = {
      subject: 'Tofu is fat',
      status: 'open'
    }

    const updateFields = {
      text: 'yes Tofu is a very fatty food',
      status: 'closed',
      details: {
        assignedAdminId: goodGuyGreg.id
      }
    }
    return createTicketAndPostUpdate(ticketFields, updateFields)
      .then(function ({ticket, ticketUpdate}) {
        expect(ticket.status).to.equal('closed')
        expect(ticketUpdate).to.deep.include({
          userId: goodGuyGreg.id,
          text: 'yes Tofu is a very fatty food',
          details: {
            assignedAdminId: goodGuyGreg.id
          }
        })
      })
  })

  it.only('should create a ticket update without status if the status is not changed', function () {
    const ticketFields = {
      status: 'closed'
    }

    const updateFields = {
      text: 'still closed!',
      status: 'closed'
    }
    return createTicketAndPostUpdate(ticketFields, updateFields)
      .then(function ({ticket, ticketUpdate}) {
        expect(ticketUpdate).to.include({
          status: null,
          text: 'still closed!'
        })
      })
  })

  it('should create a ticket update without assignee if the assignee is not changed', function () {
    const ticketFields = {
      status: 'closed',
      details: {
        assigneeId: 7
      }
    }

    const updateFields = {
      status: 'open',
      details: {
        assigneeId: 7
      }
    }

    return createTicketAndPostUpdate(ticketFields, updateFields)
      .then(function ({ticket, ticketUpdate}) {
        expect(ticketUpdate).to.include({
          status: 'open'
        })
        expect(ticketUpdate.details).to.not.have.property('assigneeId')
      })
  })
})
