const Sequelize = require('sequelize')
const dbPath = process.env.DATABASE_PATH || 'db/winder.db'
console.log(`path is ${dbPath}`);
const sequelize = new Sequelize(`sqlite://${dbPath}`, {
    // allow muting sql output when testing:
    logging: process.env.DATABASE_LOGGING === 'false' ?
        false :
        console.log
})

const User = require('./user.js')(sequelize)
const FrequentProblem = require('./frequentProblem.js')(sequelize)
module.exports = {User, FrequentProblem}
