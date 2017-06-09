const Sequelize = require('sequelize')
const dbPath = process.env.DATABASE_PATH || 'db/winder.db'
const dbURL = process.env.DATABASE_URL || `sqlite://${dbPath}`;
// const dbURL = "postgres://pjugqmxrwtegqj:fd4f702fa8bf07cc24342d65ed06be2213cb11a40294af117b218c4725c79633@ec2-107-20-186-238.compute-1.amazonaws.com:5432/d3fh9c39bc2rna"
// const dbURL = "postgres://nushi:Gf3O0ncr8Suy@localhost:5432/einavcarmon"
const sequelize = new Sequelize(dbURL, {
    // allow muting sql output when testing:
    logging: process.env.DATABASE_LOGGING === 'false' ?
        false :
        console.log
})

const User = require('./user.js')(sequelize)
const FrequentProblem = require('./frequentProblem.js')(sequelize)
module.exports = {User, FrequentProblem}
