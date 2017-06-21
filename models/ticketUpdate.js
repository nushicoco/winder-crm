const Sequelize = require('sequelize')
module.exports = function (sequelize) {
    const TicketUpdate = sequelize.define('ticket_update', {
        status: Sequelize.STRING,
        text: Sequelize.TEXT
    })

    TicketUpdate.associate = function (models) {
        TicketUpdate.belongsTo(models.Ticket)
        TicketUpdate.belongsTo(models.User)
    }

    return TicketUpdate
}
