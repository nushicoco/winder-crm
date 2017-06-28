import React from 'react'
import { Tabs, Tab, Row, Form, FormControl, Button } from 'react-bootstrap'


import './ticketUpdateForm.css'
import TicketStatusSelector from '../common/TicketStatusSelector'
import TicketForm from '../newTicket/TicketForm' //TODO MOVE

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
      isLoading: true,
      ticketFieldValues: {
        name: '',
        phone: '',
        subject: '',
        room: '',
        content: ''
      }
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

  handleTicketFieldChange (field, value) {
    const ticketFieldValues = Object.assign({}, this.state.ticketFieldValues, {[field]: value})
    this.setState({ ticketFieldValues })
  }

  render () {
    return (
      <Form className='create-ticket-update-form' >
        <Tabs defaultActiveKey={1} id='update-ticket-form-tabs'>
          <Tab eventKey={1} title={'הוספת עידכון'}>
            <FormControl
              type='textarea'
              componentClass='textarea'
              value={this.state.text}
              placeholder={strings.ticket.addUpdate}
              onChange={(e) => this.setState({text: e.target.value})} />

            <Row style={{marginTop: 10}}>
            {strings.ticket.status}:&nbsp;
            <TicketStatusSelector
                assignees={this.props.assignees}
                onSelect={assigneeId => this.setState({assigneeId})}
                expandAssigned
                onChange={(status) => this.handleStatusChange(status)}
                assigneeId={this.state.assigneeId}
                selected={this.state.status} />
            </Row>
          </Tab>

          <Tab eventKey={2} title={'עריכה'}>
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
