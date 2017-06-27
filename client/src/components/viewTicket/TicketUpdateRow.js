import React from 'react'

import strings from '../../strings.js'
import { TicketStatusIndicator } from '../common'
export default class TicketUpdateRow extends React.Component {
  renderStatusChange () {
    return (
      <span className='ticket-update-status'>
        { strings.ticket.statusUpdate }
        <TicketStatusIndicator status={this.props.ticketUpdate.status} />
      </span>
    )
  }

  renderAssignee () {
    const assigneeName = this.props.ticketUpdate.details.assigneeName
    return (
      <span className='ticket-update-assignee' >
        { strings.ticket.assignedTo + ': ' }
        { assigneeName }
      </span>
    )
  }

  formatDate (date) {
    return new Date(date).toLocaleString()
  }

  render () {
    const ticketUpdate = this.props.ticketUpdate
    const user = this.props.ticketUpdate.user
    const details = this.props.ticketUpdate.details
    const hasAssignment = details.assigneeId
    return (
      <table key={ticketUpdate.id} className='ticket-update-table'>
        <tbody>
          <tr>
            <td className='ticket-update-user'>
              { ticketUpdate.user ? `${user.firstName} ${user.lastName}:` : '' }
            </td>

            <td className='ticket-update-date ltr' >
              { this.formatDate(ticketUpdate.createdAt) }
            </td>
          </tr>

          <tr className='ticket-update-text-row' >
            <td colSpan={2}>
              <span className='ticket-update-text'>
                { ticketUpdate.text }
              </span>
              { ticketUpdate.status && this.renderStatusChange() }
              { hasAssignment && this.renderAssignee() }
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}
