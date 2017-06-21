require('dotenv-safe').load();
const { sequelize } = require('../models')
sequelize.sync({force: true})
