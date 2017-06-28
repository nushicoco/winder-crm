const mixpanel = require('mixpanel-browser')

let user = null

export const setRecordedUser = function (newUser) {
  user = newUser
}

let recordEventFn = function (event, properties) {
  // Only log events when in development env:
  console.debug(`event: "${event}"`, properties)
}

export const recordEvent = function (event, properties = {}) {
  const allProperties = Object.assign({}, properties)
  if (user) {
    allProperties.userEmail = user.email
    allProperties.isSuperuser = user.isSuperuser
  }
  recordEventFn(event, allProperties)
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.REACT_APP_MIXPANEL_TOKEN) {
    throw new Error('Mixpanel token not set')
  }

  mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN)

  // In production envl- log + send events:
  const oldRecordEventFn = recordEventFn
  recordEventFn = function (event, properties) {
    oldRecordEventFn(event, properties)
    mixpanel.track(event, properties)
  }
}
