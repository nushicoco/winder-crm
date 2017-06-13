const Sequelize = require('sequelize')

module.exports = function (sequelize) {
    const Ticket = sequelize.define('ticket', {
        subject: Sequelize.STRING,
        status: {
            type: Sequelize.STRING,
            validate: {
                isIn: [['open', 'closed']]
            }
        }
    })

    Ticket.associate = function (models) {
        Ticket.belongsTo(models.User)
        Ticket.hasMany(models.TicketUpdate)
    }

    return Ticket
}
