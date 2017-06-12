import React from 'react'
import './viewTicket.css'
export default class ViewTicket extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            ticket: {
                user: {},
                ticket_updates: []
            }
        }
    }

    componentDidMount () {
        this.fetchData()
    }

    fetchData = () => {
        fetch(`/tickets/${this.props.match.params.id}`)
            .then( (response) => {
                return response.json()
            })

            .then( (ticket) => {
                this.setState({
                    ticket
                })
            })
    }

    formatDate(date) {
        return new Date(date).toLocaleString()
    }

    renderTicketUpdate = (ticketUpdate) => {
        const user = ticketUpdate.user
        return (
            <div>
              <hr />
              <span>
                { user.firstName} {user.lastName},
              </span>
              <span className="ticket-update-date">
                { this.formatDate(ticketUpdate.createdAt) }
              </span>

              <div className="ticket-update-text">
                { ticketUpdate.text }
              </div>
            </div>
        )
    }

    render () {
        const user = this.state.ticket.user || {}
        const ticketUpdates = this.state.ticket.ticket_updates || []
        return (
            <div>
              <h2> { this.state.ticket.subject  } </h2>
              <h3> { `${user.firstName} ${user.lastName}`}</h3>
              <h4>
                { this.formatDate(this.state.ticket.createdAt) }
              </h4>
              { ticketUpdates.map(this.renderTicketUpdate) }
            </div>
        )
    }
}
