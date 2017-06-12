const Sequelize = require('sequelize')
const bcrypt = require('bcrypt-nodejs')

const USER_LENGTH_VALIDATION = [2, 20]

module.exports = function (sequelize) {
    let User = sequelize.define('user', {
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

    User.associate = function (models) {
        User.hasMany(models.Ticket)
        User.hasMany(models.TicketUpdate)
    }

    return User
}
