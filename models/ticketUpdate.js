const Sequelize = require('sequelize')
module.exports = function (sequelize) {
    const TicketUpdate = sequelize.define('ticket_update', {
        text: Sequelize.TEXT,
        newStatus: {
            type: Sequelize.ENUM,
            values: ['open', 'close']
        }
    })
    TicketUpdate.sync()
    return TicketUpdate
}
