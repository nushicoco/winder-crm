import React from 'react'
import { DropdownButton, MenuItem, ButtonGroup, Button } from 'react-bootstrap'

import Strings from '../../../strings'

export default class TicketStatusSelector extends React.Component {
  renderAssignedButton () {
    let buttonTitle = Strings.ticket.statuses.assigned
    let assignee = this.props.assignees.find(assignee => assignee.id === this.props.assigneeId)
    if (assignee) {
      buttonTitle += ': ' + assignee.firstName
    }
    return (
      <DropdownButton
        active={this.props.selected === 'assigned' || this.props.selected.assigned}
        onSelect={id => this.props.onSelect(id)}
        className={'ticket-status-selector-button ticket-status-assigned'}
        onClick={() => this.props.onChange('assigned')}
        bsSize={this.props.bsSize}
        title={buttonTitle}
        id='assigned-status'>

        <MenuItem eventKey={null} >{Strings.ticket.noAssignee}</MenuItem>
        <MenuItem divider />
        { this.props.assignees.map(user => (
          <MenuItem eventKey={user.id} key={user.id} >{user.firstName}</MenuItem>
        ))}
      </DropdownButton>
    )
  }

  renderStatusButton (status) {
    return (
      <Button
        active={this.props.selected === status || this.props.selected[status]}
        className={`ticket-status-selector-button ticket-status-${status}`}
        onClick={() => this.props.onChange(status)}
        bsSize={this.props.bsSize}>
        { Strings.ticket.statuses[status] }
      </Button>
    )
  }

  render () {
    return (
      <ButtonGroup>
        { this.renderStatusButton('open') }
        { this.props.expandAssigned
          ? this.renderAssignedButton()
          : this.renderStatusButton('assigned')
        }
        { this.renderStatusButton('closed') }
      </ButtonGroup>
    )
  }
}
