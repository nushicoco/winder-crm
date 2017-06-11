const Sequelize = require('sequelize')

module.exports = function (sequelize) {
    const Ticket = sequelize.define('ticket', {
        subject: Sequelize.STRING
    })
    Ticket.sync()
    return Ticket
}
