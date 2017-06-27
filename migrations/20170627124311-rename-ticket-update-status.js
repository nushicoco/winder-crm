module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query("UPDATE ticket_updates SET status='assigned' WHERE status='inTherapy'")
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query("UPDATE ticket_updates SET status='inTherapy' WHERE status='assigned'")
  }
}
