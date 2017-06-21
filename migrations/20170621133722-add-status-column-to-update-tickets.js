'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('ticket_updates', 'status', {
          type: Sequelize.STRING,
          allowNull: true
      })
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('ticket_updates', 'status')
  }
};
