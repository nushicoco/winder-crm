'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

      queryInterface.createTable("chats", {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER
          },
          active: {
              type: Sequelize.BOOLEAN,
              defaultValue: true
          },

          clientName: Sequelize.TEXT,
          clientId: Sequelize.TEXT,

          createdAt: {
              allowNull: false,
              type: Sequelize.DATE
          },
          updatedAt: {
              allowNull: false,
              type: Sequelize.DATE
          }
      });

      queryInterface.sequelize.query([
                  `CREATE TABLE chatMessages ( 
                                      id            INTEGER PRIMARY KEY NOT NULL, 
                                      client        TEXT, 
                                      clientId      TEXT,
                                      text          TEXT,
                                      chat_id       INTEGER,
                                      FOREIGN KEY (chat_id) REFERENCES chats(id)
                                      );`,
              ].join(''),
              { raw: true });
  },

  down: function (queryInterface, Sequelize) {

      return queryInterface.dropTable('chats');
      return queryInterface.dropTable('chatMessages');

  }
};
