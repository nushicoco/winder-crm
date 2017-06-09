const Sequelize = require('sequelize')
const dbPath = process.env.DATABASE_PATH || 'db/winder.db'
const dbURL = process.env.DATABASE_URL || `sqlite://${dbPath}`;
const sequelize = new Sequelize(dbURL, {
    // allow muting sql output when testing:
    logging: process.env.DATABASE_LOGGING === 'false' ?
        false :
        console.log
})

const User = require('./user.js')(sequelize)
const FrequentProblem = require('./frequentProblem.js')(sequelize)
module.exports = {User, FrequentProblem}
