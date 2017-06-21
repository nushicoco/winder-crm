const path = require("path");
const Sequelize = require('sequelize')
const dbURL = process.env.DATABASE_URL
const sequelize = new Sequelize(dbURL, {
    // allow muting sql output when testing:
    logging: process.env.DATABASE_LOGGING === 'false' ?
        false :
        console.log
});

// Models:

const models = {
    User             : sequelize.import(path.join(__dirname, './user.js')),
    FrequentProblem  : sequelize.import(path.join(__dirname, './frequentProblem.js')),
    TicketUpdate     : sequelize.import(path.join(__dirname, './ticketUpdate.js')),
    Ticket           : sequelize.import(path.join(__dirname, './ticket.js')),
    Chat             : sequelize.import(path.join(__dirname, './chat.js')),
    ChatMessage      : sequelize.import(path.join(__dirname, './chatMessage.js'))
}

// Set Relations:
Object.values(models).forEach( model => model.associate && model.associate(models) )

// All set
sequelize.sync()
// sequelize.sync({force:true})

module.exports = Object.assign(
    models,
    {sequelize}
)
