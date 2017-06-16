import React from 'react'
import { Link } from 'react-router-dom'
import { Table, Col, Row, FormGroup, Form, FormControl, ControlLabel, Button} from 'react-bootstrap'
import './viewTicket.css'
import { getTicket, updateTicket, updateTicketStatus} from '../../api.js'
import strings from '../../strings.js'
import LoadingSpinner from '../loadingSpinner.js'

export default class ViewTicket extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            newUpdateText: '',
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
        this.setState({isLoading: true})
        getTicket(this.props.match.params.id)
            .then( (ticket) => {
                this.setState({
                    ticket,
                    isLoading: false
                })
            })
    }

    formatDate(date) {
        return new Date(date).toLocaleString()
    }

    renderTicketUpdate = (ticketUpdate) => {
        const user = ticketUpdate.user || {}
        return (
            <table key={ticketUpdate.id} className="ticket-update-table">
                <tbody>
              <tr>
                <td className="ticket-update-user">
                  {user.firstName} {user.lastName}:
                </td>

                <td className="ticket-update-date ltr" >
                  { this.formatDate(ticketUpdate.createdAt) }
                </td>
              </tr>

              <tr className="ticket-update-text" >
                <td colSpan={2}>
                  { ticketUpdate.text }
                </td>
              </tr>
                </tbody>
            </table>
            )
    }

    handleSubmitUpdate = (e) => {
        e.preventDefault()
        const text = this.state.newUpdateText
        this.setState({
            newUpdateText: '',
            isLoading: true
        })
        updateTicket(this.state.ticket.id, this.state.newUpdateText)
            .then( () => {
                this.fetchData()
            })
    }

    updateTicketStatus = () => {
        this.setState({ isLoading: true})
        updateTicketStatus(this.state.ticket.id, this.state.ticket.status)
            .then( () => {
                this.setState({editStatusMode: false})
                this.fetchData()
            })
    }

    handleTicketStatusChange = (e) => {
        this.setState({ticket: Object.assign({}, this.state.ticket, {status: e.target.value})})
    }

    renderUpdateStatus = () => {
        if (this.state.editStatusMode) {
            return (
                  <form>
                    <select value={this.state.ticket.status} onChange={this.handleTicketStatusChange}>
                      <option value="closed"> { strings.ticket.statuses.closed } </option>
                      <option value="open"> { strings.ticket.statuses.open } </option>
                  </select>
                    <Button
                      onClick={ () => this.updateTicketStatus() }
                      bsSize="xsmall"
                      disabled={ this.state.isUpdatingStatus } >
                      { strings.ticket.submit }
                    </Button>
                  </form>
            )
        }

        return (
            <div>
              <span className={ `status-${this.state.ticket.status}` } >
                { strings.ticket.statuses[this.state.ticket.status]  }
              </span>&nbsp;
              <Button
                bsSize="xsmall"
                onClick = { () => this.setState({editStatusMode: true})}
                >עדכן</Button>
            </div>
        )
    }
    render () {
        const user = this.state.ticket.user || {}
        const ticketUpdates = this.state.ticket.ticket_updates || []
        return (
            <div>
              <LoadingSpinner show={ this.state.isLoading } />
              <h1>קריאה #{ this.state.ticket.id }</h1>
              <Table className="ticket-view-table" condensed>
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
                    <td className="main-column ltr">
                      { strings.ticket.dateIssued }
                    </td>
                    <td className="value-column ltr">
                      { this.formatDate(this.state.ticket.createdAt) }
                    </td>
                  </tr>

                  <tr>
                    <td className="main-column">
                      { strings.ticket.status}
                    </td>
                    <td className="value-column">
                      { this.renderUpdateStatus() }
                    </td>
                  </tr>
                </tbody>
              </Table>

              <hr/>
              <div className="updates">
                <h2>{ strings.ticket.updates } </h2>
                <Form>
                  <Row>
                    <Col sm={10} >
                  <FormControl
                    className="update-text-input"
                    type="text"
                    value={ this.state.newUpdateText }
                    placeholder={ strings.ticket.addUpdate }
                    onChange={ (e) => this.setState({newUpdateText: e.target.value}) } />
                    </Col>
                    <Col sm={2}>
                    <Button
                      className="update-text-button"
                      type="submit"
                      disabled={ this.state.loading }
                      onClick={ this.handleSubmitUpdate }>
                      { strings.ticket.submit }
                    </Button>
                    </Col>
                  </Row>
                </Form>
                { this.state.ticket.ticket_updates.map(this.renderTicketUpdate) }

              </div>
              <hr/>
              <Link to="/admin/tickets">{ strings.back }</Link>

            </div>
        )
    }
}
