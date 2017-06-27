import React from 'react'
import { Col, Row, Form, FormControl, Button } from 'react-bootstrap'
import TicketStatusSelector from '../common/TicketStatusSelector'

import strings from '../../strings.js'
import './viewTicket.css'

export default class CreateTicketUpdateForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      status: props.ticket.status,
      assigneeid: props.assigneeId,
      text: '',
      assigned: null,
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

  handleAssigned (assignedId) {
    this.setState({
      assigneeId: assignedId
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
              assignees={this.props.assignees}
              onAssigned={assignedId => this.handleAssigned(assignedId)}
              expandInTherapy
              onChange={(status) => { this.setState({status}) }}
              assignedId={this.props.assignedId}
              selected={this.state.status} />

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
