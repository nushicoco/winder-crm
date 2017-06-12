const Sequelize = require('sequelize')
module.exports = function (sequelize) {
    const TicketUpdate = sequelize.define('ticket_update', {
        text: Sequelize.TEXT,
        newStatus: {
            type: Sequelize.STRING,
            validate: {
                isIn: ['open', 'close']
            }
        }
    })

    TicketUpdate.associate = function (models) {
        TicketUpdate.belongsTo(models.Ticket)
    }

    return TicketUpdate
}
