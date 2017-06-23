const debug = require('debug')
require('dotenv-safe').load()

module.exports = {
  development: {
    url: `sqlite:///${__dirname}/winder.db`,
    dialect: 'sqlite'
  },

  test: {
    url: `sqlite:///${__dirname}/winder_test.db`,
    dialect: 'sqlite'
  },

  production:   {
    url: `sqlite:///${__dirname}/winder.db`,
    dialect: 'sqlite'
  }
}
