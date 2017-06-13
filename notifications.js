const notificationUrl = process.env.NOTIFICATION_URL
const request = require('request')
const hostname=process.env.HOSTNAME

const notify = function (payload) {
    request.post({
        url: notificationUrl,
        body: JSON.stringify(payload)
    })

}

module.exports.notifyNewTicket = function (ticket) {
    if (!ticket.subject || !ticket.id) {
        throw 'Cannot notify about a ticket with no subject or id'
    }
    const ticketLink = `${hostname}/view-ticket/${ticket.id}`
    notify({text: `A new ticket has been opened:\n"${ticket.subject}"\n<${ticketLink}|More Details>`})
}
