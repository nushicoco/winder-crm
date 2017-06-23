const notificationUrl = process.env.NOTIFICATION_URL
const request = require('request')
const hostname=process.env.HOSTNAME

const notify = function (payload) {
    if (notificationUrl === 'false' ) {
        return
    }

    request.post({
        url: notificationUrl,
        body: JSON.stringify(payload)
    })

};

module.exports.notifyNewChat = function (chat) {

    if (!chat) {
        throw 'Cannot notify without a chat'
    }

    const chatLink = `${hostname}/chat`;
    notify({text: `A new chat has been requested: by ${chat.client}\n<${chatLink}|Go to Chat>`})
};

module.exports.notifyNewTicket = function (ticket) {
    if (!ticket.id) {
        throw 'Cannot notify about a ticket with no id'
    }
    const ticketLink = `${hostname}/view-ticket/${ticket.id}?accessToken=${ticket.accessToken}`
    notify({text: `A new ticket has been opened:\n"${ticket.details.name} at room #${ticket.details.room}"\n<${ticketLink}|More Details>`})
};
