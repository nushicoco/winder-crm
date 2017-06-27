module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('ticket_updates', 'details', Sequelize.TEXT)
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('ticket_updates', 'details')
  }
}
