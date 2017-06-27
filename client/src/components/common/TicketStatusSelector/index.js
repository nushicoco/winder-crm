import React from 'react'
import { DropdownButton, MenuItem, ButtonGroup, Button } from 'react-bootstrap'

import Strings from '../../../strings'

export default class TicketStatusSelector extends React.Component {
  renderInTherapyButton () {
    if (this.props.expandInTherapy) {
      let buttonTitle = Strings.ticket.statuses.inTherapy
      let assignee = this.props.assignees.find(assignee => assignee.id === this.props.assigneeId)
      if (assignee) {
        buttonTitle += ': ' + assignee.firstName
      }
      return (
        <DropdownButton
          active={this.props.selected === 'inTherapy'}
          onSelect={id => this.props.onSelect(id)}
          className={'ticket-status-selector-button ticket-status-inTherapy'}
          onClick={() => this.props.onChange('inTherapy')}
          bsSize={this.props.bsSize}
          title={buttonTitle}
          id='inTherapy-status'>

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
          active={this.props.selected === 'inTherapy'}
          className={'ticket-status-selector-button ticket-status-inTherapy'}
          onClick={() => this.props.onChange('inTherapy')}
          bsSize={this.props.bsSize}>
          { Strings.ticket.statuses.inTherapy }
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

        { this.renderInTherapyButton() }
      </ButtonGroup>
    )
  }
}
