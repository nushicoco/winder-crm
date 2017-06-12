const Sequelize = require('sequelize')

module.exports = function (sequelize) {
    const Ticket = sequelize.define('ticket', {
        subject: Sequelize.STRING
    })

    Ticket.associate = function (models) {
        Ticket.belongsTo(models.User)
        Ticket.hasMany(models.TicketUpdate)
    }

    return Ticket
}
