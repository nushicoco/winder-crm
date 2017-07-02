/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const { User, Ticket, TicketUpdate } = require('../../models')

const chai = require('chai')
const expect = chai.expect
chai.should()

let goodGuyGreg

const makeGreg = function () {
  return User.sync({force: true})
        .then(function () {
          return User.create({
            firstName: 'greg',
            lastName: 'goodguy',
            password: 'conference',
            isSuperuser: true,
            email: 'goodguygreg@deer.com'
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

  it('should be possible to retreive ticketUpdates belonging to a Ticket', function () {
    let ticketId
    return Ticket.create({
      userId: goodGuyGreg.id,
      details: {
        content: 'great sbject'
      }
    })
            .then(function (ticket) {
              ticketId = ticket.id
              return TicketUpdate.create({
                ticketId,
                text: 'great text'
              })
            })
            .then(function () {
              return Ticket.findOne({
                where: {
                  id: ticketId
                },
                include: TicketUpdate
              })
            })
            .then(function (ticket) {
              expect(ticket).to.have.property('ticket_updates')
              expect(ticket.ticket_updates).to.have.lengthOf(1)
            })
  })

  it('should be created with random access tokens', function () {
    const COUNT = 100
    const accessTokens = []
    const tickets = Array.from(new Array(COUNT))
              .map(_ => Ticket.create()
                    .then(
                        ticket => accessTokens.push(ticket.accessToken)
                    )
                  )
    return Promise.all(tickets)
            .then(function () {
              const keys = {}
              accessTokens.forEach(function (accessToken) {
                expect(keys[accessToken]).to.be.undefined
                accessTokens[accessToken] = 'EXISTS!'
              })
            })
  })
})
