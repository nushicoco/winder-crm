module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query("UPDATE tickets SET status='assigned' WHERE status='inTherapy'")
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query("UPDATE tickets SET status='inTherapy' WHERE status='assigned'")
  }
}
