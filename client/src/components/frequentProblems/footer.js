import React, { Component } from 'react'
import { ButtonToolbar } from 'react-bootstrap'
import { NewTicketButton, NewChatButton } from '../common'
import Strings from '../../strings'
import Settings from '../../settings'

import './frequentProblems.css'

export default class Footer extends Component {
  constructor (props) {
    super(props)
    this.state = { shouldHide: props.shouldHide }
  }

  render () {
    return (
      <div className='footer'>
        <ButtonToolbar>
          {this.props.user && <NewChatButton isSuperuser={this.props.user && this.props.user.isSuperuser} />}
          <NewTicketButton />
        </ButtonToolbar>
        <p className='call-us'> { Strings.frequentProblems.callTech } - { Settings.techPhone }</p>
      </div>
    )
  }
};
