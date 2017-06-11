const Sequelize = require('sequelize')
const dbURL = process.env.DATABASE_URL || 'sqlite://db/winder.db';
const sequelize = new Sequelize(dbURL, {
    // allow muting sql output when testing:
    logging: process.env.DATABASE_LOGGING === 'false' ?
        false :
        console.log
});

// Models:
const  User             = require('./user.js')(sequelize),
       FrequentProblem  = require('./frequentProblem.js')(sequelize),
       TicketUpdate     = require('./ticketUpdate.js')(sequelize),
       Ticket           = require('./ticket.js')(sequelize)

// Relations:
Ticket.belongsTo(User)
User.hasMany(Ticket)
TicketUpdate.belongsTo(Ticket)
Ticket.hasMany(TicketUpdate)
console.log('index.js\\ 19: <here>');

module.exports = {
    User,
    FrequentProblem,
    Ticket,
    TicketUpdate
}
