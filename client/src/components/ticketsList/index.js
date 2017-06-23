import React from 'react'
import { Link } from 'react-router-dom'
import strings from '../../strings.js'
import {  Button, Table} from 'react-bootstrap'
import { getTickets } from '../../api.js'
import {BackToFrequentBtn} from '../common'

export default class TicketsList extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            tickets: [],
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

    isSuperuser () {
        return this.state.user && this.state.user.isSuperuser
    }

    render () {
        let headers = [
            (<th>#</th>)
        ]

        if (this.isSuperuser()) {
            headers = headers.concat([
                (<th>{ strings.ticket.user } </th>),
                (<th>{ strings.ticket.name } </th>)
            ])
        }

        headers = headers.concat([
                (<th>{ strings.ticket.subject }</th>),
                (<th>{ strings.ticket.status }</th>),
                (<th>{ strings.ticket.dateIssued }</th>),
                (<th>{ strings.ticket.dateUpdated }</th>)
        ])

        return (
            <div>
              { this.state.user && (
                <h1>{ strings.TicketsList.headline[this.state.user.isSuperuser ? 'admin' : 'user'] }</h1>
              )}
              <Table className="center centered" striped bordered condensed hover>
                <thead>
                  <tr>
                { headers }
                  </tr>
                </thead>
                <tbody>
                  { this.state.tickets.map(this.renderTicket) }
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

    renderTicket = (ticket) => {
        const user = ticket.user || {}

        let ticketCells = [
            (<td>{ ticket.id } </td>)
        ]

        if (this.isSuperuser()) {
            ticketCells = ticketCells.concat([
                (<td >{ `${user.firstName || ''} ${user.lastName || ''}`} </td>),
                (<td >{ ticket.details.name }     </td>)
            ])
        }

        ticketCells = ticketCells.concat([
            (<td  > <Link to={ `/view-ticket/${ticket.id}?accessToken=${ticket.accessToken}` }> { ticket.details.subject } </Link> </td>),
            (<td className={ `ticket-status-${ticket.status}`} >{ strings.ticket.statuses[ticket.status] }</td>),
            (<td className="ltr" > { this.formatDate(ticket.createdAt) }</td>),
            (<td className="ltr" > { this.formatDate(ticket.updatedAt) }</td>)
        ])


        return (
            <tr  key={ ticket.id } >
              { ticketCells }
            </tr>
        )
    }
}
