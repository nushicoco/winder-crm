import React from 'react'
import { Link } from 'react-router-dom'
import { Table, Col, Row, FormGroup, Form, FormControl, ControlLabel, Button} from 'react-bootstrap'
import './viewTicket.css'
import { getTicket } from '../../api.js'

import strings from '../../strings.js'

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
        getTicket(this.props.match.params.id)
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
        const user = ticketUpdate.user || {}
        return (
            <table className="ticket-update-table">
              <tr>
                <td sm={6} className="ticket-update-user">
                  {user.firstName} {user.lastName}:
                </td>

                <td sm={6} className="ticket-update-date" >
                  { this.formatDate(ticketUpdate.createdAt) }
                </td>
              </tr>

              <tr className="ticket-update-text" >
                <td colSpan={2}>
                  { ticketUpdate.text }
                </td>
              </tr>
            </table>
            )
    }

    handleSubmitUpdate = () => {
        // TBD
    }

    render () {
        const user = this.state.ticket.user || {}
        const ticketUpdates = this.state.ticket.ticket_updates || []
        return (
            <div>
              <h1>קריאה #{ this.state.ticket.id }</h1>
              <table className="ticket-view-table" condensed>
                <tbody>
                  <tr>
                    <td className="main-column">
                      { strings.ticket.subject }
                    </td>
                    <td className="value-column">
                       { this.state.ticket.subject  }
                    </td>
                  </tr>

                  <tr>
                    <td className="main-column">
                      { strings.ticket.user }
                    </td>
                    <td className="value-column">
                      { `${user.firstName} ${user.lastName} (${user.email})` }
                    </td>
                  </tr>

                  <tr>
                    <td className="main-column">
                      { strings.ticket.dateIssued }
                    </td>
                    <td className="value-column">
                      { this.formatDate(this.state.ticket.createdAt) }
                    </td>
                  </tr>

                  <tr>
                    <td className="main-column">
                      { strings.ticket.status}
                    </td>
                    <td className={ `value-column status-${this.state.ticket.status}` }>
                      { strings.ticket.statuses[this.state.ticket.status]  }
                    </td>
                  </tr>
                </tbody>
              </table>

              <hr/>
              <h2>עדכונים:</h2>
              <FormGroup controlId="addNewTicketUpdate">
                <ControlLabel>{ strings.ticket.addUpdate }:</ControlLabel>
                <FormControl
                  type="text"
                  value={ this.state.newUpdateText }
                  placeHolder=""
                  onChange={ (e) => this.setState({newUpdateText: e.target.value}) } />
                  <Button type="submit" onClick={ this.handleSubmitUpdate }>
                    { strings.ticket.submit }
                  </Button>
              </FormGroup>
              { this.state.ticket.ticket_updates.map(this.renderTicketUpdate) }

              <hr/>
              <Link to="/tickets-admin">{ strings.back }</Link>

            </div>
        )
    }
}
