const Sequelize = require('sequelize')
const bcrypt = require('bcrypt-nodejs')
const dbPath = process.env.DATABASE_PATH || 'db/winder.db'
const sequelize = new Sequelize(`sqlite://${dbPath}`, {
    logging: process.env.DATABASE_LOGGING !== 'false'
})
const USER_LENGTH_VALIDATION = [2, 20]

const User = sequelize.define('user', {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: USER_LENGTH_VALIDATION
        }
    },

    lastName: {
        type: Sequelize.STRING,
        validate: {
            len: USER_LENGTH_VALIDATION
        }
    },

    email: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },

    password: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: true
        }
    }
})

User.beforeCreate( (user, options) => {
    user.password = bcrypt.hashSync(user.password)
})

User.prototype.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

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
