import React from 'react'
import { Tabs, Tab, Row, Form, FormControl, Button } from 'react-bootstrap'

import './ticketUpdateForm.css'
import TicketStatusSelector from '../common/TicketStatusSelector'
import TicketForm from '../common/TicketForm'

import strings from '../../strings'
import './viewTicket.css'

export default class CreateTicketUpdateForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      status: props.ticket.status,
      assigneeId: props.ticket.details.assigneeId,
      text: '',
      assigned: null,
      admins: [],
      isLoading: true,
      ticketFieldValues: this.ticketFieldValuesFromTicket(props.ticket)
    }
  }

  componentWillReceiveProps ({ticket}) {
    this.setState({
      ticketFieldValues: this.ticketFieldValuesFromTicket(ticket),
      assigneeId: ticket.details.assigneeId
    })
  }

  ticketFieldValuesFromTicket (ticket) {
    return Object.assign(
      {
        name: '',
        phone: '',
        subject: '',
        room: '',
        content: ''
      },
      ticket.details
    )
  }

  handleSubmitUpdate (e) {
    const { text, status, assigneeId, ticketFieldValues } = this.state
    e.preventDefault()
    this.setState({
      text: ''
    })
    const details = Object.assign({}, ticketFieldValues, {assigneeId})
    this.props.onSubmit({
      text, status, details
    })
  }
  handleStatusChange (status) {
    let assigneeId = status === 'assigned' ? this.state.assigneeId : null
    this.setState({
      status, assigneeId
    })
  }

  handleTicketFieldChange (field, value) {
    const ticketFieldValues = Object.assign({}, this.state.ticketFieldValues, {[field]: value})
    this.setState({ ticketFieldValues })
  }

  render () {
    return (
      <Form className='create-ticket-update-form' >
        <Tabs defaultActiveKey={1} id='update-ticket-form-tabs'>
          <Tab eventKey={1} title={strings.ticket.addUpdate}>
            <FormControl
              type='textarea'
              componentClass='textarea'
              value={this.state.text}
              placeholder={strings.ticket.addUpdate}
              onChange={(e) => this.setState({text: e.target.value})} />

            <Row style={{marginTop: 10}}>
              { strings.ticket.status }:&nbsp;
              <TicketStatusSelector
                assignees={this.props.assignees}
                onSelect={assigneeId => this.setState({assigneeId})}
                expandAssigned
                onChange={(status) => this.handleStatusChange(status)}
                assigneeId={this.state.assigneeId}
                selected={this.state.status} />
            </Row>
          </Tab>

          <Tab eventKey={2} title={strings.ticket.edit}>
            <TicketForm
              fieldValues={this.state.ticketFieldValues}
              onFieldChange={this.handleTicketFieldChange.bind(this)} />
          </Tab>
        </Tabs>

        <Button
          className='create-update-form-submit-button'
          type='submit'
          disabled={this.state.isLoadingUpdates}
          onClick={e => this.handleSubmitUpdate(e)}>
          { strings.ticket.update }
        </Button>
      </Form>
    )
  }
}
