const { notifyNewTicket } = require('../notifications.js')
const Sequelize = require('sequelize')

module.exports = function (sequelize) {
    const Ticket = sequelize.define('ticket', {
        details: {
            type: Sequelize.TEXT,
            set(val) {
                this.setDataValue('details', JSON.stringify(val))
            },
            get() {
                return JSON.parse(this.getDataValue('details') || '{}')
            }
        },
        status: {
            type: Sequelize.STRING,
            validate: {
                isIn: [['open', 'closed', 'inTherapy']]
            }
        }
    }, {
        hooks: {
            afterCreate: function (ticket) {
                notifyNewTicket(ticket)
            }
        }
    })

    Ticket.associate = function (models) {
        Ticket.belongsTo(models.User)
        Ticket.hasMany(models.TicketUpdate)
    }

    return Ticket
}
