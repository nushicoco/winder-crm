import React from 'react'
import {Row, Col, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import Strings from '../../strings';

import './newTicket.css'

import { createTicket } from '../../api.js'
import { BackToFrequentBtn } from '../common';
const AVAILABLE_SUBJECTS = Strings.ticket.subjects
const AVAILABLE_ROOMS = [
      '501' , '502' , '503' , '504' , '505' , '506' , '507'
    , '508' , '509' , '510' , '511' , '512' , '513' , '514'
    , '515' , '516' , '517' , '518' , '519' , '520' , '521'
    , '522' , '523' , '524' ,
    , '601' , '602' , '603' , '604' , '605' , '606' , '607'
    , 'Mix1' , 'Mix2' ]
    // TOOD Move to client-specific configuration

export default class NewTicket extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            submitted: false,
            name: '',
            phone: '',
            subject: AVAILABLE_SUBJECTS[0],
            room: AVAILABLE_ROOMS[0],
            content: ''
        }
    }

    handleSubmit = () => {
        const { name, phone, room, content, subject } = this.state
        this.setState({isLoading: true})
        createTicket({name, phone, room, content, subject})
            .then( ({ id, accessToken }) => {
                this.setState({
                    isLoading: false,
                    submitted: true,
                    ticketId: id,
                    accessToken
                })
            })
    }

    getValidationState(value) {
        const length = value.length;
        if (length > 5) return 'success';
        else if (length > 2) return 'warning';
        else if (length > 0) return 'error';
    }

    renderSubmitted = () => {
        const { ticketId, accessToken } = this.state
        const ticketUrl = `view-ticket/${ticketId}?accessToken=${accessToken}`
        return (
            <div>
              { Strings.ticket.sent }
              <br/>
              <Link to={ ticketUrl }>
                <Button bsStyle="primary">
                  { Strings.ticket.watchMyTicket }
                </Button>
              </Link>
            </div>
            )
    }

    render = () => {
        return (
            <div className="container">
                {this.state.submitted ?
                    this.renderSubmitted()
                    : this.renderForm()}
            </div>
        )
    }

    renderField = (field, type, { children, validationState, style, componentClass} = {} ) => {
        return (
            <Row>
              <FormGroup controlId={ field }
                         validationState={ validationState } >
                <Col componentClass={ControlLabel} sm={4} className="subject-label" >
                  {Strings.ticket[field] }
                </Col>
                <Col sm={8}>
                  <FormControl
                    type={ type }
                    value={ this.state[field] }
                    componentClass={ componentClass }
                    style={ style }
                    onChange={ e => this.setState({[field]: e.target.value}) }>
                    { children }
                  </FormControl>
                </Col>
              </FormGroup>
            </Row>
        )
    }

    renderTextField = (field, validateLength) => {
        return this.renderField(field, 'text', {
            validationState: (validateLength && this.getValidationState(this.state[field])) || null
        })
    }

    renderTextareaField = (field) => {
        return this.renderField(field, 'textarea', {
            style: {height: 100 },
            componentClass: 'textarea'
        })
    }

    renderSelectField = (field, options) => {
        const children = options.map(option => (
            <option key={ option } value={ option } >{ option }</option>
        ))

        return this.renderField(field, 'select', {
            children,
            componentClass: 'select'
        })
    }

    renderForm = () => {
        return (
            <div>
              <h1>{Strings.ticket.openTicketHeader}</h1>
              <Form>
                { this.renderTextField('name', true ) }
                { this.renderTextField('phone') }
                { this.renderSelectField('subject', AVAILABLE_SUBJECTS) }
                { this.renderSelectField('room', AVAILABLE_ROOMS) }
                { this.renderTextareaField('content') }

                <Row>
                    <Button bsStyle="primary"
                            className="submit-ticket"
                            disabled={ this.state.isLoading || !this.state.name}
                            type="submit"
                            onClick={ this.handleSubmit }>{ Strings.ticket.submit }
                    </Button>
                    <BackToFrequentBtn />
                </Row>
              </Form>
            </div>
        )
    }
}
