const { onlySuperuser } = require('./helpers')
module.exports = function (app, passport) {
  const {User, Ticket, TicketUpdate} = require('../models')

  app.post('/ticket', (req, res) => {
    let userId = req.user && req.user.id

    Ticket.create({
      details: req.body,
      status: 'open',
      userId
    })
      .then((ticket) => {
        const { id, accessToken } = ticket
        res.status(200).send({id, accessToken})
      })

      .catch((error) => {
        console.error(error)
        throw error
      })
  })

  app.post('/update_ticket', onlySuperuser, (req, res) => {
    const {ticketId, text, details, status} = req.body
    const userId = req.user.id
    let newDetails, newStatus
    Ticket.findById(ticketId)
      .then((ticket) => {
        const update = {}
        let needsUpdate = false

        // Check if new details are introduced:
        Object.keys(details || {}).forEach((key) => {
          if (ticket.details[key] !== details[key]) {
            newDetails = newDetails || Object.assign({}, ticket.details)
            newDetails[key] = details[key]
          }
        })
        if (newDetails) {
          needsUpdate = true
          update.details = newDetails
        }

        // Check if new Status is set:
        if (ticket.status !== status) {
          needsUpdate = true
          newStatus = status
          update.status = status
        }

        if (needsUpdate) {
          return ticket.update(update)
        }
      })

      .then(() => {
        return TicketUpdate.create({
          ticketId,
          text,
          status: newStatus,
          details: newDetails,
          userId
        })
      })
      .then((newTicketUpdate) => {
        res.status(200).send()
      })
      .catch((error) => {
        console.error(error)
        res.status(400).send()
      })
  })

  app.get('/tickets/:id', function (req, res) {
    Ticket.findOne({
      where: {
        id: req.params.id
      },
      include: [{all: true, nested: true}],
      order: [[TicketUpdate, 'createdAt', 'DESC']]
    })
      .then((ticket) => {
        const accessToken = req.query.accessToken
        const isSuperuser = req.user && req.user.isSuperuser

        if (ticket.accessToken === accessToken || isSuperuser) {
          res.status(200).send(ticket)
        } else {
          res.status(401).send()
        }
      })
      .catch((error) => {
        console.error(error)
        res.sendStatus(400)
      })
  })

  app.get('/tickets', (req, res) => {
    if (!req.user) {
      return res.status(401).send({errorMessage: 'no user is not logged in'})
    }

    var where = req.user.isSuperuser ? {} : {userId: req.user.id}
    Ticket.findAll({include: [TicketUpdate, User], where: where})
      .then(function (tickets) {
        res.status(200).send(tickets.map(ticket => ticket.toJSON()))
      })

      .catch((error) => {
        console.error(error)
        throw error
      })
  })

  app.get('/admin/admins', onlySuperuser, (req, res) => {
    return User.findAll({
      where: { isSuperuser: true }
    })
      .then(superusers =>
            res.status(200).send(superusers.map(superuser =>
                                                superuser.toJSON())))
  })
}
