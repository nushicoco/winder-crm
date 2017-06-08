const Sequelize = require('sequelize')
sequelize.define('frequentProblem', {
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
