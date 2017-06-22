/**
 * Created by einavcarmon on 20/06/2017.
 */
const { notifyNewChat } = require('../notifications.js')
const Sequelize = require('sequelize')

module.exports = function (sequelize) {
    const Chat = sequelize.define('chat', {
        status: {
            type: Sequelize.STRING,
            validate: {
                isIn: [['active', 'closed']]
            }
        },

        client: Sequelize.TEXT,

}, {
        hooks: {
            afterCreate: function (chat) {
                notifyNewChat(chat)
            }
        }
    });

    Chat.associate = function (models) {
        Chat.hasMany(models.ChatMessage)
    };

    return Chat;
};