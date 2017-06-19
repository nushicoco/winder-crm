import React from 'react'
import { Link } from 'react-router-dom'
import strings from '../../strings.js'
import {  Button, Table} from 'react-bootstrap'
import './ticketsAdmin.css'
import { getTickets } from '../../api.js'

export default class TicketsAdmin extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            tickets: []
        }
    }

    reload = () => {
        getTickets()
            .then( (tickets) => {
                this.setState({
                    tickets
                })
            })
    }

    componentDidMount () {
        this.reload()
    }

    render () {
        return (
            <div>
              <h1>{ strings.ticketsAdmin.headline }</h1>
              <Table className="center centered" striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{ strings.ticket.user } </th>
                    <th>{ strings.ticket.subject }</th>
                    <th>{ strings.ticket.status }</th>
                    <th>{ strings.ticket.dateIssued }</th>
                    <th>{ strings.ticket.dateUpdated }</th>
                  </tr>
                </thead>
                <tbody>
                  { this.state.tickets.map(this.renderTicket) }
                </tbody>
              </Table>

              <Button onClick={ () => this.reload() } >
                { strings.ticketsAdmin.reload }
              </Button>

            </div>
        )
    }
    formatDate (date) {
        return new Date(date).toLocaleString()
    }

    renderTicket = (ticket) => {
        const user = ticket.user || {}
        return (
            <tr  key={ ticket.id } >
                <th>{ ticket.id }       </th>
                <th >{ user ? `${user.firstName} ${user.lastName}` : ''}     </th>
                <th  >
                  <Link to={ `/view-ticket/${ticket.id}` }>
                    { ticket.subject }
                  </Link>
                </th>
                <th className={ `ticket-${ticket.status}`} >{ strings.ticket.statuses[ticket.status] }</th>
                <th className="ltr" > { this.formatDate(ticket.createdAt) }</th>
                <th className="ltr" > { this.formatDate(ticket.updatedAt) }</th>
            </tr>
        )
    }
}
