import React from 'react'
import { Col, Row, Form, FormControl, Button } from 'react-bootstrap'
import { TicketStatusSelector } from '../common'

import strings from '../../strings.js'
import './viewTicket.css'

export default class CreateTicketUpdateForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      status: props.ticket.status,
      text: '',
      assigneeId: null,
      admins: [],
      isLoading: true
    }
  }

  handleSubmitUpdate (e) {
    const { text, status, assigneeId } = this.state
    e.preventDefault()
    this.setState({
      text: ''
    })
    this.props.onSubmit({
      text, status, assigneeId
    })
  }

  render () {
    return (
      <Form>
        <Row>
          <Col sm={8} >
            <FormControl
              type='text'
              value={this.state.text}
              placeholder={strings.ticket.addUpdate}
              onChange={(e) => this.setState({text: e.target.value})} />
          </Col>

          <Col sm={4} >
            <TicketStatusSelector
              selected={this.state.status}
              onChange={status => this.setState({status})} />
            <Button
              className='create-update-form-text-button'
              type='submit'
              disabled={this.state.isLoadingUpdates}
              onClick={e => this.handleSubmitUpdate(e)}>
              { strings.ticket.submit }
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
