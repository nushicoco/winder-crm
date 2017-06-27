import React from 'react'
import queryString from 'query-string'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

import './viewTicket.css'
import { TicketStatusIndicator } from '../common'
import TicketUpdateRow from './TicketUpdateRow'
import CreateTicketUpdateForm from './CreateTicketUpdateForm'
import { getTicket, updateTicket, getAdmins } from '../../api.js'
import strings from '../../strings.js'
import LoadingBox from '../loadingBox'
const SHOW_FIELDS = ['name', 'room', 'subject', 'content', 'assigneeName']

export default class ViewTicket extends React.Component {
  constructor (props) {
    super(props)
    const accessToken = queryString.parse(props.location.search).accessToken
    this.state = {
      admins: [],
      isInitialLoading: true,
      accessToken: accessToken,
      isLoggedUser: props.user,
      isSuperuser: props.user && props.user.isSuperuser,
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
    getAdmins().then((admins) => {
      this.setState({admins})
    })
  }

  fetchData () {
    getTicket(this.props.match.params.id, this.state.accessToken)
      .then((ticket) => {
        this.setState({
          ticket,
          isLoadingUpdates: false,
          isInitialLoading: false
        })
      })
      .catch((error) => {
        this.setState({
          isLoadingUpdates: 'error',
          isInitialLoading: 'error'
        })
        console.error(error)
      })
  }

  formatDate (date) {
    return new Date(date).toLocaleString()
  }

  handleSubmitUpdate ({ text, status, assigneeId }) {
    this.setState({
      isLoadingUpdates: true
    })
    const ticketId = this.state.ticket.id
    const assignee = this.state.admins.find(admin => admin.id === assigneeId) || null
    const assigneeName = assignee && assignee.firstName
    updateTicket({
      ticketId,
      text,
      status,
      details: {assigneeId, assigneeName}
    })
      .then(() => {
        this.fetchData()
      })
  }

  renderField (field) {
    return this.renderTicketInfo(field, this.state.ticket.details[field])
  }

  renderTicketInfo (name, value, opts = {}) {
    return (
      <tr key={name || Math.random()}>
        <td className='main-column'>
          { strings.ticket[name] }
        </td>
        <td className={`value-column ${opts.leftToRight && 'ltr'}`}>
          { value }
        </td>
      </tr>
    )
  }
  componentWillReceiveProps (newProps) {
    this.setState({
      isLoggedUser: newProps.user,
      isSuperuser: newProps.user && newProps.user.isSuperuser
    })
  }

  renderNewUpdateForm () {
    return (
      <div>
        <CreateTicketUpdateForm
          assignees={this.state.admins}
          assigneeId={this.state.ticket.details.assigneeId}
          ticket={this.state.ticket}
          onSubmit={fields => this.handleSubmitUpdate(fields)} />
        <LoadingBox show={this.state.isLoadingUpdates}>&nbsp;</LoadingBox>
      </div>
    )
  }

  renderUpdatesTable () {
    const updates = this.state.ticket.ticket_updates.length > 0
          ? this.state.ticket.ticket_updates.map(ticketUpdate => <TicketUpdateRow key={ticketUpdate.id} ticketUpdate={ticketUpdate} />)
          : strings.ticket.noUpdates
    return (
      <div className='updates'>
        <h2>{ strings.ticket.updates } </h2>
        { this.state.isSuperuser && this.renderNewUpdateForm() }
        { updates }
      </div>

    )
  }

  render () {
    const user = this.state.ticket.user
    const userDetails = user ? `${user.firstName} ${user.lastName} (${user.email})` : ''

    return (
      <LoadingBox show={this.state.isInitialLoading}>
        <div className='container'>
          <h1>
            { strings.ticket.headlinePrefix + this.state.ticket.id }
          </h1>
          <Table className='ticket-view-table' condensed>
            <tbody>
              { Object.keys(this.state.ticket.details).filter(field => SHOW_FIELDS.indexOf(field) > -1).map(field => this.renderField(field)) }

              { this.renderTicketInfo('user', userDetails) }
              { this.renderTicketInfo('dateIssued', this.formatDate(this.state.ticket.createdAt), {leftToRight: true})}

              <tr>
                <td className='main-column'>
                  { strings.ticket.status}
                </td>
                <td className='value-column'>
                  <TicketStatusIndicator status={this.state.ticket.status} />
                </td>
              </tr>

            </tbody>
          </Table>

          { this.renderUpdatesTable() }
          <hr />
          <Link to={this.state.isLoggedUser ? '/tickets' : '/'} > { strings.back } </Link>
        </div>
      </LoadingBox>
    )
  }
}
