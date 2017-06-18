import React from 'react'
import {Row, Col, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'

import Strings from '../../strings';

import './newTicket.css'

import { createTicket } from '../../api.js'
import { BackToFrequentBtn } from '../common';
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
            subject: '',
            text: ''
        }
    }

    handleSubmit = () => {
        const {subject, room, text} = this.state
        this.setState({isLoading: true})
        createTicket(subject, room, text)
            .then( () =>  {
                this.setState({
                    isLoading: false,
                    submitted: true
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
         // TODO: something else here?
        return (
            <div>
              { Strings.ticket.sent }
              <br/>
              <BackToFrequentBtn></BackToFrequentBtn>
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

    renderForm = () => {
        return (
            <div>
              <h1>{Strings.ticket.openTicketHeader}</h1>
              <Form>
                <Row>
                  <FormGroup controlId="subject"
                             validationState={this.getValidationState(this.state.subject)}>
                    <Col componentClass={ControlLabel} sm={4} className="subject-label" >
                      {Strings.ticket.subject }
                    </Col>
                    <Col sm={8}>
                      <FormControl
                        type="text"
                        value={ this.state.subject }
                        onChange={ e => this.setState({subject: e.target.value}) }/>
                    </Col>
                  </FormGroup>
                </Row>

                <Row>
                  <FormGroup controlId="room" >
                    <Col componentClass={ControlLabel} sm={4} className="subject-label" >
                      {Strings.ticket.room }
                    </Col>
                    <Col sm={8} className="align-right">
                      <FormControl componentClass="select" onChange={ e=> this.setState({room: e.target.value}) } >
                        { AVAILABLE_ROOMS.map(room => (
                            <option value={ room } >{ room }</option>
                        ))}
                      </FormControl>
                    </Col>
                  </FormGroup>
                </Row>

                <Row>
                  <FormGroup controlId="text">
                    <Col componentClass={ControlLabel} sm={4} className="subject-label"
                         validationState={this.getValidationState(this.state.text)}>
                      {Strings.ticket.text }
                    </Col>
                    <Col sm={8}>
                      <FormControl
                        style={ {height: 100 } }
                        type="textarea"
                        componentClass="textarea"
                        value={ this.state.text }
                        onChange={ e => this.setState({text: e.target.value}) }/>
                    </Col>
                  </FormGroup>
                </Row>

                <Row>
                  <Col sm={12}>
                    <Button bsStyle="primary"
                            className="submit-ticket"
                            disabled={ this.state.isLoading || !this.state.subject}
                            type="submit"
                            onClick={ this.handleSubmit }>{ Strings.ticket.submit }
                    </Button>
                    <BackToFrequentBtn></BackToFrequentBtn>
                  </Col>
                </Row>
              </Form>
            </div>
        )
    }
}
