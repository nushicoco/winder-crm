import React from 'react'
import queryString from 'query-string'
import { Link } from 'react-router-dom'
import { Table, Col, Row, FormGroup, Form, FormControl, ControlLabel, Button} from 'react-bootstrap'

import './viewTicket.css'
import { getTicket, updateTicket, updateTicketStatus} from '../../api.js'
import strings from '../../strings.js'
import LoadingSpinner from '../loadingSpinner.js'
const TICKET_STATUSES = ['open', 'closed', 'inTherapy']

export default class ViewTicket extends React.Component {
    constructor (props) {
        super(props)
        const accessToken = queryString.parse(props.location.search).accessToken
        this.state = {
            newUpdateText: '',
            accessToken: accessToken,
            ticket: {
                id: '',
                user: {},
                details: {},
                ticket_updates: []
            }
        }
    }

    componentDidMount () {
        this.fetchData()
    }

    fetchData = () => {
        this.setState({isLoading: true})
        getTicket(this.props.match.params.id, this.state.accessToken)
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

    renderStatusUpdate = (status) => {
        return (
            <span className="ticket-update-status">
            { strings.ticket.statusUpdate }
                <span className={ `ticket-status-${status}` }>
                { strings.ticket.statuses[status] }
                </span>
            </span>
        )

    }

    renderTicketUpdate = (ticketUpdate) => {
        const user = ticketUpdate.user
        let ticketUpdateContent = ticketUpdate.status
            ? this.renderStatusUpdate(ticketUpdate.status)
            : ticketUpdate.text
        return (
            <table key={ticketUpdate.id} className="ticket-update-table">
                <tbody>
              <tr>
                <td className="ticket-update-user">
                  { ticketUpdate.user ? `${user.firstName} ${user.lastName}:` : '' }
                </td>

                <td className="ticket-update-date ltr" >
                  { this.formatDate(ticketUpdate.createdAt) }
                </td>
              </tr>

              <tr className="ticket-update-text" >
                <td colSpan={2}>
                  { ticketUpdateContent }
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
                      {TICKET_STATUSES.map( status => (
                          <option key={ status } value={ status }> { strings.ticket.statuses[status] } </option>
                      ))}
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
              <span className={ `ticket-status-${this.state.ticket.status}` } >
                { strings.ticket.statuses[this.state.ticket.status]  }
              </span>&nbsp;
              { this.state.isSuperuser &&  (
              <Button
                bsSize="xsmall"
                onClick = { () => this.setState({editStatusMode: true})}
                >עדכן</Button>
              )}

            </div>
        )
    }

    renderField = (field,index) => {
        return this.renderTicketInfo(field, this.state.ticket.details[field], index)
    }

    renderTicketInfo = (name, value, index) => {
        return (
            <tr key={index || Math.random()}>
              <td className="main-column">
                { strings.ticket[name] }
              </td>
              <td className="value-column">
                { value }
              </td>
            </tr>
        )
    }
    componentWillReceiveProps (newProps) {
        this.setState({
            isSuperuser: newProps.user && newProps.user.isSuperuser
        })
    }

    renderNewUpdateForm = () => {
        return (
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
        )
    }
    renderUpdatesTable () {
        const updates = this.state.ticket.ticket_updates.length > 0
              ?  this.state.ticket.ticket_updates.map(this.renderTicketUpdate)
              : strings.ticket.noUpdates
        return (
            <div className="updates">
              <h2>{ strings.ticket.updates } </h2>
              { this.state.isSuperuser && this.renderNewUpdateForm() }
              { updates }
            </div>

        )
    }

    render () {
        const user = this.state.ticket.user
        const userDetails =  user ? `${user.firstName} ${user.lastName} (${user.email})` : ''
        const ticketUpdates = this.state.ticket.ticket_updates || []
        const linkBack = this.state.isSuperuser
              ? '/admin/tickets'
              : '/'


        return (
            <div>
              <LoadingSpinner show={ this.state.isLoading } />
              <h1>
                { strings.ticket.headlinePrefix + this.state.ticket.id }
              </h1>
              <Table className="ticket-view-table" condensed>
                <tbody>
                  { Object.keys(this.state.ticket.details).map( (field, index) => this.renderField(field, index) ) }

                  { this.renderTicketInfo('user', userDetails) }
                  { this.renderTicketInfo('dateIssued',  this.formatDate(this.state.ticket.createdAt)) }

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
              { this.renderUpdatesTable() }
              <hr/>
              <Link to={ linkBack }>{ strings.back }</Link>
            </div>
        )
    }
}
