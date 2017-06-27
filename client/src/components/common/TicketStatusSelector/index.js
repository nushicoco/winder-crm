import React from 'react'
import { DropdownButton, MenuItem, ButtonGroup, Button } from 'react-bootstrap'

import Strings from '../../../strings'

export default class TicketStatusSelector extends React.Component {
  renderAssignedButton () {
    if (this.props.expandAssigned) {
      let buttonTitle = Strings.ticket.statuses.assigned
      let assignee = this.props.assignees.find(assignee => assignee.id === this.props.assigneeId)
      if (assignee) {
        buttonTitle += ': ' + assignee.firstName
      }
      return (
        <DropdownButton
          active={this.props.selected === 'assigned'}
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
    } else {
      return (
        <Button
          active={this.props.selected === 'assigned'}
          className={'ticket-status-selector-button ticket-status-assigned'}
          onClick={() => this.props.onChange('assigned')}
          bsSize={this.props.bsSize}>
          { Strings.ticket.statuses.assigned }
        </Button>
      )
    }
  }
  render () {
    const extra = this.props.extra
    return (
      <ButtonGroup>
        { extra && (
        <Button
          active={this.props.selected === extra}
          className={`ticket-status-selector-button ticket-status-${extra}`}
          onClick={() => this.props.onChange(extra)}
          bsSize={this.props.bsSize}>
          { Strings.ticket.statuses[extra] }
        </Button>

        )}
        <Button
          active={this.props.selected === 'open'}
          className={'ticket-status-selector-button ticket-status-open'}
          onClick={() => this.props.onChange('open')}
          bsSize={this.props.bsSize}>
          { Strings.ticket.statuses.open }
        </Button>

        <Button
          active={this.props.selected === 'closed'}
          className={'ticket-status-selector-button ticket-status-closed'}
          onClick={() => this.props.onChange('closed')}
          bsSize={this.props.bsSize}>
          { Strings.ticket.statuses.closed }
        </Button>

        { this.renderAssignedButton() }
      </ButtonGroup>
    )
  }
}
