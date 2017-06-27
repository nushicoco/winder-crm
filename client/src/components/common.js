/**
 * Created by einavcarmon on 14/06/2017.
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { ButtonGroup, Button } from 'react-bootstrap'

import Strings from '../strings'
import './common.css'

export const BackToFrequentBtn = () => (
  <Link to='/' className='back-btn'>
    { Strings.frequentProblems.back }
  </Link>)

export class NewTicketButton extends React.Component {
  render () {
    return (
      <Link to='/new-ticket' >
        <Button bsStyle='primary' className='open-ticket'>
          { Strings.ticket.openTicket }
        </Button>
      </Link>
    )
  }
}

export class NewChatButton extends React.Component {
  render () {
    return (
      <Link to='/chat'>
        <Button className='open-chat'>
          {this.props.isSuperuser
            ? Strings.chat.techChat
            : Strings.chat.newChat
          }
        </Button>
      </Link>
    )
  }
}

export class TicketStatusIndicator extends React.Component {
  render () {
    return (
      <span className={`ticket-status-${this.props.status}`}>
        { Strings.ticket.statuses[this.props.status] }
      </span>
    )
  }
}

const AVAILABLE_STATUSES = ['open', 'closed', 'inTherapy']
export class TicketStatusSelector extends React.Component {
  render () {
    const statuses = (this.props.extra ? [this.props.extra] : [])
        .concat(AVAILABLE_STATUSES)

    return (
      <ButtonGroup>
        {statuses.map(status => (
          <Button
            key={status}
            active={this.props.selected === status}
            className={`ticket-status-selector-button ticket-status-${status}`}
            onClick={() => this.props.onChange(status)}
            bsSize={this.props.bsSize}>
            { Strings.ticket.statuses[status] }
          </Button>
        ))
        }
      </ButtonGroup>
    )
  }
}
