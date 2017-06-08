const Sequelize = require('sequelize')
module.exports = function (sequelize) {
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
    return FrequentProblem
}
