const Sequelize = require('sequelize')
module.exports = function (sequelize) {
  const TicketUpdate = sequelize.define('ticket_update', {
    status: Sequelize.STRING,
    text: Sequelize.TEXT,
    details: {
      type: Sequelize.TEXT,
      set (val) {
        this.setDataValue('details', JSON.stringify(val))
      },
      get () {
        return JSON.parse(this.getDataValue('details') || '{}')
      }
    }
  })

  TicketUpdate.associate = function (models) {
    TicketUpdate.belongsTo(models.Ticket)
    TicketUpdate.belongsTo(models.User)
  }

  return TicketUpdate
}
