import React from 'react'
import {Col, Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap'
import strings from '../../strings.js'
import { Link } from 'react-router-dom'
import './newTicket.css'
import { createTicket } from '../../api.js'

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
        const {subject, text} = this.state
        this.setState({isLoading: true})
        createTicket(subject, text)
            .then( () =>  {
                this.setState({
                    isLoading: false,
                    submitted: true
                })
            })
    }
    renderSubmitted = () => {
        // TODO: something else here?
        return (
            <div>
              { strings.ticket.sent }
              <br/>
              <Link to="/"> { strings.back }</Link>
            </div>
            )
    }

    render = () => {
        return this.state.submitted ?
            this.renderSubmitted()
            : this.renderForm()
    }

    renderForm = () => {
        return (
            <Form>
              <FormGroup controlId="subject">
                <Col componentClass={ControlLabel} sm={4} >
                  {strings.ticket.subject }
                </Col>
                <Col sm={8}>
                  <FormControl
                    type="text"
                    value={ this.state.subject }
                    onChange={ e => this.setState({subject: e.target.value}) }/>
                </Col>
              </FormGroup>


              <FormGroup controlId="text">
                <Col componentClass={ControlLabel} sm={4} >
                  {strings.ticket.text }
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

              <Col sm={12}>
                <Button
                  disabled={ this.state.isLoading }
                  type="submit"
                  onClick={ this.handleSubmit }>{ strings.ticket.submit }
                </Button>
              </Col>
            </Form>
        )
    }
}
