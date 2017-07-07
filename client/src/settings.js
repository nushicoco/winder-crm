const customerSettings = require('./settings.json') // ./settings.json is customer-specific
const DEFAULT_SETTINGS = {
  minNameLength: 1,
  minPasswordLength: 1,
  logo: process.env.PUBLIC_URL + '/img/logo.png',
  rooms: [],
  subjects: customerSettings.subjects,
  techPhone: customerSettings.techPhone
}

export default Object.assign(DEFAULT_SETTINGS, customerSettings)
