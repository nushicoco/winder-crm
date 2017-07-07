import React from 'react'

import strings from '../../strings'
import { TicketStatusIndicator } from '../common'
export default class TicketUpdatesTable extends React.Component {
  renderStatusChange (status) {
    return (
      <span className='ticket-update-status'>
        { strings.ticket.statusUpdate }
        <TicketStatusIndicator status={status} />
      </span>
    )
  }

  renderAssignee (assigneeId) {
    const assignee = this.props.assignees.find(assignee => assignee.id === assigneeId)
    if (!assignee) {
      return (
        <span className='ticket-update-assignee' >
          { strings.ticket.assigneeRemoved }
        </span>
      )
    }
    const assigneeName = assignee ? assignee.firstName : ''
    return (
      <span className='ticket-update-assignee' >
        { strings.ticket.assignedTo + ': ' }
        <span className='ticket-update-detail-value'>
        { assigneeName }
        </span>
      </span>
    )
  }

  formatDate (date) {
    return new Date(date).toLocaleString()
  }

  renderDetail (detailName, detailValue) {
    if (detailName === 'assigneeId') {
      return this.renderAssignee(detailValue)
    }

    return (
      <span className='ticket-update-detail' >
        <span className='ticket-update-detail-name' >
          { strings.ticket[detailName] }
        </span>
        &nbsp;
        { strings.ticket.changedTo }
        &nbsp;
        <span className='ticket-update-detail-value' >
          { detailValue }
        </span>
      </span>
    )
  }

  render () {
    if (this.props.updates.length === 0) {
      return (
        <span>
          {strings.ticket.noUpdates}
        </span>
      )
    }

    let updates = this.props.updates
        .map(this.renderUpdate.bind(this))

    let updateRows = []
    for (let [updateHeadRow, updateContentRow] of updates) {
      updateRows.push(updateHeadRow)
      updateRows.push(updateContentRow)
    }

    return (
      <table className='ticket-update-table'>
        <tbody>
          { updateRows }
        </tbody>
      </table>
    )
  }

  renderUpdate (ticketUpdate) {
    const user = ticketUpdate.user
    const details = ticketUpdate.details

    let changes = null
    if (ticketUpdate.status) {
      changes = [this.renderStatusChange(ticketUpdate.status)]
    }

    if (details) {
      let detailDescriptions = Object.keys(details)
          .map(detail =>
               this.renderDetail(detail, details[detail]))
      changes = (changes || []).concat(detailDescriptions)
    }

    if (changes) {
      changes = (
        <ul className='ticket-details-list'>
          { changes.map((change, index) => (<li key={index} >{change}</li>)) }
        </ul>
      )
    }
    const headRow = (
      <tr key={ticketUpdate.id + '_head'} className='ticket-update-head-row' >
        <td className='ticket-update-user'>
          { ticketUpdate.user ? `${user.firstName} ${user.lastName}:` : '' }
        </td>

        <td className='ticket-update-date ltr' >
          { this.formatDate(ticketUpdate.createdAt) }
        </td>
      </tr>
    )
    const bodyRow = (
      <tr key={ticketUpdate.id + '_body'} className='ticket-update-text-row' >
        <td colSpan={2}>
          {ticketUpdate.text && (
            <span className='ticket-update-text'>
              { ticketUpdate.text }
            </span>
          )}
          { changes }
        </td>
      </tr>
    )
    return [headRow, bodyRow]
  }
}
