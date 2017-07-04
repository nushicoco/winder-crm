import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import Strings from '../../strings'
import { recordEvent } from '../../analytics'
import { createTicket } from '../../api.js'

import './newTicket.css'
import TicketForm from '../common/TicketForm'

export default class NewTicket extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: props.user,
      submitted: false,
      fieldValues: {
        name: this.makeUserName(props.user),
        phone: '',
        subject: '',
        room: '',
        content: ''
      }
    }
  }

  makeUserName (user) {
    return (user && user.firstName + ' ' + user.lastName) || ''
  }

  componentWillReceiveProps (newProps) {
    if (newProps.user) {
      const fieldValues = Object.assign({}, this.state.fieldValues, {
        name: this.makeUserName(newProps.user)
      })

      this.setState({
        user: newProps.user,
        fieldValues
      })
    }
  }

  handleSubmit () {
    let { name, phone, room, content, subject } = this.state.fieldValues
    name = name.trim()
    content = content.trim()
    phone = phone.trim()
    this.setState({isLoading: true})
    recordEvent('Ticket Created', {name, subject, content, room, phone})
    createTicket({name, phone, room, content, subject})
            .then(({ id, accessToken }) => {
              this.setState({
                isLoading: false,
                submitted: true,
                ticketId: id,
                accessToken
              })
            })
  }

  isFormReady () {
    const {name, room, subject} = this.state.fieldValues
    return !this.state.isLoading &&
          name.trim().length > 0 &&
          subject.length > 0 &&
          room.length > 0
  }

  handleFieldChange (field, value) {
    const fieldValues = Object.assign({}, this.state.fieldValues, {[field]: value})
    this.setState({ fieldValues })
  }

  render () {
    if (this.state.submitted) {
      return (
        <TicketSubmitted
          ticketId={this.state.ticketId}
          accessToken={this.state.accessToken} />
      )
    }

    return (
      <div className='container'>
        <h1>{ Strings.ticket.openTicketHeader }</h1>
        <TicketForm
          fieldValues={this.state.fieldValues}
          lockName={this.state.user}
          onFieldChange={this.handleFieldChange.bind(this)} />
        <Row>
          <Col sm={6}>
            <Button
              bsStyle='primary'
              className='submit-ticket'
              disabled={!this.isFormReady()}
              type='submit'
              onClick={() => this.handleSubmit()}>{ Strings.ticket.submit }
            </Button>
          </Col>

          <Col sm={6}>
            <Link to='/'>
              <Button className='cancel-new-ticket'>
                { Strings.frequentProblems.back }
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    )
  }
}

const TicketSubmitted = function ({ticketId, accessToken}) {
  const ticketUrl = `view-ticket/${ticketId}?accessToken=${accessToken}`
  return (
    <div>
      { Strings.ticket.sent }
      <br />
      <Link to={ticketUrl}>
        <Button bsStyle='primary'>
          { Strings.ticket.watchMyTicket }
        </Button>
      </Link>
    </div>
  )
}
