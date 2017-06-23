'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('tickets', 'accessToken', Sequelize.STRING)
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('tickets', 'accessToken')
  }
};
