const customerSettings = require('./settings.json')
export default {
  logo: customerSettings.logo || process.env.PUBLIC_URL + '/img/logo.png',
  rooms: [].concat(customerSettings.rooms || []),
  subjects: [].concat(customerSettings.subjects || []),
  techPhone: customerSettings.techPhone || ''
}
