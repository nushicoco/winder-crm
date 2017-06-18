const mixpanel = require('mixpanel-browser')

let user = {}

let setRecordedUser = function (newUser) {
    user = newUser
}

let recordEvent = function () { }

if (process.env.NODE_ENV === 'production') {

    if (!process.env.REACT_APP_MIXPANEL_TOKEN) {
        throw 'Mixpanel token not set'
    }

    mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN)
    recordEvent = function (event, properties) {
        const allProperties = Object.assign({}, {userId: user && user.id }, properties)
        mixpanel.track(event, allProperties)
    }
}

module.exports.recordEvent = recordEvent
module.exports.setRecordedUser = setRecordedUser
