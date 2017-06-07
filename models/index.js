const Sequelize = require('sequelize')
const dbPath = process.env.DATABASE_PATH || 'db/winder.db'
const sequelize = new Sequelize(`sqlite://${dbPath}`)

const User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING
    },
    lastName: {
        type: Sequelize.STRING
    }
})

User.sync()

const FrequentProblem = sequelize.define('frequentProblem', {
    env: {
        type: Sequelize.TEXT
    },

    subEnv: {
        type: Sequelize.TEXT
    },

    subject: {
        type: Sequelize.STRING
    },

    solution: {
        type: Sequelize.TEXT
    }
})
FrequentProblem.sync()

module.exports = {User, FrequentProblem}
