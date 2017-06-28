import React from 'react'
import {Row, Col, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import Strings from '../../strings'
import { recordEvent } from '../../analytics'
import './newTicket.css'

import { createTicket } from '../../api.js'
const AVAILABLE_SUBJECTS = Strings.ticket.subjects
const AVAILABLE_ROOMS = [
  '501', '502', '503', '504', '505', '506', '507',
  '508', '509', '510', '511', '512', '513', '514',
  '515', '516', '517', '518', '519', '520', '521',
  '522', '523', '524',
  '601', '602', '603', '604', '605', '606', '607',
  'Mix1', 'Mix2', 'אחר']
    // TOOD Move to client-specific configuration

const DEFAULT_SELECT_OPTION = Strings.ticket.select
export default class NewTicket extends React.Component {
  constructor (props) {
    super(props)
    AVAILABLE_ROOMS.splice(0, 0, DEFAULT_SELECT_OPTION)
    AVAILABLE_SUBJECTS.splice(0, 0, DEFAULT_SELECT_OPTION)
    this.state = {
      user: props.user,
      submitted: false,

      name: this.makeUserName(props.user),
      phone: '',
      subject: DEFAULT_SELECT_OPTION,
      room: DEFAULT_SELECT_OPTION,
      content: ''
    }
  }

  makeUserName (user) {
    return (user && user.firstName + ' ' + user.lastName) || ''
  }

  componentWillReceiveProps (newProps) {
    if (newProps.user) {
      this.setState({
        user: newProps.user,
        name: this.makeUserName(newProps.user)
      })
    }
  }

  handleSubmit () {
    let { name, phone, room, content, subject } = this.state
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

  getValidationState (value) {
    const length = value.length
    if (length > 5) return 'success'
    else if (length > 2) return 'warning'
    else if (length > 0) return 'error'
  }

  renderSubmitted () {
    const { ticketId, accessToken } = this.state
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

  render () {
    return (
      <div className='container'>
        {this.state.submitted
                    ? this.renderSubmitted()
                    : this.renderForm()}
      </div>
    )
  }

  renderField (field, type, { children, validationState, style, componentClass, locked } = {}) {
    return (
      <Row>
        <FormGroup controlId={field}
          validationState={validationState} >
          <Col componentClass={ControlLabel} sm={4} className='subject-label' >
            {Strings.ticket[field] }
          </Col>
          <Col sm={8}>
            <FormControl
              type={type}
              disabled={locked}
              value={this.state[field]}
              componentClass={componentClass}
              style={style}
              onChange={e => this.setState({[field]: e.target.value})}>
              { children }
            </FormControl>
          </Col>
        </FormGroup>
      </Row>
    )
  }

  renderTextField (field, {validateLength, locked} = {}) {
    return this.renderField(field, 'text', {
      locked,
      validationState: (validateLength && this.getValidationState(this.state[field])) || null
    })
  }

  renderTextareaField (field) {
    return this.renderField(field, 'textarea', {
      style: { height: 100 },
      componentClass: 'textarea'
    })
  }

  renderSelectField (field, options) {
    const children = options.map(option => (
      <option key={field + option} value={option} >{ option }</option>
        ))

    return this.renderField(field, 'select', {
      children,
      componentClass: 'select'
    })
  }

  renderForm () {
    const formReady = !this.state.isLoading &&
              this.state.name.trim().length > 0 &&
              this.state.room !== DEFAULT_SELECT_OPTION &&
              this.state.subject !== DEFAULT_SELECT_OPTION

    return (
      <div>
        <h1>{Strings.ticket.openTicketHeader}</h1>
        <Form>
          { this.renderTextField('name', {validateLength: true, locked: this.state.user}) }
          { this.renderTextField('phone') }
          { this.renderSelectField('subject', AVAILABLE_SUBJECTS) }
          { this.renderSelectField('room', AVAILABLE_ROOMS) }
          { this.renderTextareaField('content') }

          <Row>
            <Col sm={6}>
              <Button bsStyle='primary'
                className='submit-ticket'
                disabled={!formReady}
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
        </Form>
      </div>
    )
  }
}
