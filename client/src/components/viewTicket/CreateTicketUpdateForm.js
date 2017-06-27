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
      assigneeId: props.assigneeId,
      text: '',
      assigned: null,
      admins: [],
      isLoading: true
    }
  }

  componentWillReceiveProps ({assigneeId}) {
    this.setState({
      assigneeId
    })
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
  handleStatusChange (status) {
    let assigneeId = status === 'assigned' ? this.state.assigneeId : null
    this.setState({
      status, assigneeId
    })
  }

  render () {
    return (
      <Form className='create-ticket-update-form'>
        <Row>
          <FormControl
            type='textarea'
            componentClass='textarea'
            value={this.state.text}
            placeholder={strings.ticket.addUpdate}
            onChange={(e) => this.setState({text: e.target.value})} />
        </Row>

        <Row style={{marginTop: 10}}>
          {strings.ticket.status}:&nbsp;
          <TicketStatusSelector
            assignees={this.props.assignees}
            onSelect={assigneeId => this.setState({assigneeId})}
            expandAssigned
            onChange={(status) => this.handleStatusChange(status)}
            assigneeId={this.state.assigneeId}
            selected={this.state.status} />

          <Button
            className='create-update-form-submit-button'
            type='submit'
            disabled={this.state.isLoadingUpdates}
            onClick={e => this.handleSubmitUpdate(e)}>
            { strings.ticket.update }
          </Button>
        </Row>
      </Form>
    )
  }
}
