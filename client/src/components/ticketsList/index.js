import React from 'react'
import { Link } from 'react-router-dom'
import strings from '../../strings.js'
import { Button, ButtonGroup, Table} from 'react-bootstrap'
import { getTickets } from '../../api.js'
import { BackToFrequentBtn } from '../common'
import './ticketsList.css'
import CSVExport from './csvexport'

const NO_FILTER = 'all'
export default class TicketsList extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            tickets: [],
            filter: 'all',
            user: props.user
        }
    }

    reload = () => {
        getTickets()
            .then( (tickets) => {
                this.setState({
                    tickets
                })
            })
            .catch( (error) => {
                if (error.status === 401) {
                    this.props.doLogin()
                    return
                }
                console.error(error)
            })
    }

    filteredTickets = (() => {
        let allTickets, filteredTickets, lastFilter
        return () => {
            if (this.state.tickets === allTickets
                && this.state.filter === lastFilter )  {
                return filteredTickets
            }
            allTickets = this.state.tickets
            filteredTickets = allTickets.filter(this.filter)
            lastFilter = this.state.filter
            return filteredTickets
        }
    })()

    ticketsAsDataForCSV = () => {
        const headers = [[
            'id',
            'username',
            'name',
            'subject',
            'status',
            'createdAt',
            'updatedAt'
        ]]
        return headers.concat(this.filteredTickets().map(ticket => [
            ticket.id,
            this.formatUsername(ticket.user),
            ticket.details.name,
            ticket.details.subject,
            ticket.status,
            ticket.createdAt,
            ticket.updatedAt,
        ]))
    }

    componentWillReceiveProps (newProps) {
        if (this.props.user !== newProps.user) {
            this.setState({
                user: newProps.user
            })
            this.reload()
        }
    }

    componentDidMount () {
        this.reload()
    }

    renderFilters() {
        const buttons = [NO_FILTER, 'open', 'closed', 'inTherapy'].map( status => (
            <Button
              key={ status }
              active={ this.state.filter === status }
              className={ `tickets-list-filter-button ticket-status-${status}` }
              onClick={ () => this.setState({filter: status}) }
              bsSize="xsmall">
              { strings.ticket.statuses[status] }
            </Button>
        ))
        return (
            <div className="tickets-list-filters">
              { strings.ticket.filters }
              <ButtonGroup>
                { buttons }
              </ButtonGroup>
              <CSVExport className="inline" data={this.ticketsAsDataForCSV()} filename="tickets.csv"/>

            </div>
        )
    }

    filter = (ticket) => {
        return this.state.filter === NO_FILTER || ticket.status === this.state.filter
    }

    render () {
        return (
            <div>
              { this.state.user && (
                <h1>{ strings.TicketsList.headline[this.state.user.isSuperuser ? 'admin' : 'user'] }</h1>
              )}

            { this.renderFilters() }
              <Table className="center centered" striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{ strings.ticket.user } </th>
                    <th>{ strings.ticket.name } </th>
                    <th>{ strings.ticket.subject }</th>
                    <th>{ strings.ticket.status }</th>
                    <th>{ strings.ticket.dateIssued }</th>
                    <th>{ strings.ticket.dateUpdated }</th>
                  </tr>
                </thead>
                <tbody>
                { this.filteredTickets().map(this.renderTicket) }
                </tbody>
              </Table>

              <Button onClick={ () => this.reload() } >
                { strings.TicketsList.reload }
              </Button>

                <BackToFrequentBtn/>
            </div>
        )
    }
    formatDate (date) {
        return new Date(date).toLocaleString()
    }

    formatUsername (user) {
        return user
            ? `${user.firstName || ''} ${user.lastName || ''}`
            : ''
    }

    renderTicket = (ticket) => {
        const user = ticket.user || {}
        return (
            <tr  key={ ticket.id } >
                <th>{ ticket.id }       </th>
                <th >{ this.formatUsername(user) } </th>
                <th >{ ticket.details.name }     </th>
                <th  >
                  <Link to={ `/view-ticket/${ticket.id}?accessToken=${ticket.accessToken}` }>
                    { ticket.details.subject }
                  </Link>
                </th>
                <th className={ `ticket-status-${ticket.status}`} >{ strings.ticket.statuses[ticket.status] }</th>
                <th className="ltr" > { this.formatDate(ticket.createdAt) }</th>
                <th className="ltr" > { this.formatDate(ticket.updatedAt) }</th>
            </tr>
        )
    }
}
