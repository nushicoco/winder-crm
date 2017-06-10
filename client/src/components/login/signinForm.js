import React, { Component } from 'react'
import { Button, Col, FormControl, ControlLabel, Form, FormGroup } from 'react-bootstrap'

import Strings from '../../strings.js'
import validations from './validations.js'

export default class SigninForm extends Component {

    constructor (props) {
        super(props)
        this.state = {
            email: '',
            password: ''
        }
    }

    handleInputChange = (e) => {
        const newState = Object.assign({}, this.state, {[e.target.name]: e.target.value })
        newState.valid = this.isValid(newState)
        this.setState(newState)
        this.props.onChange(newState)
    }

    isValid (state) {
        return validations.email(state.email)
            && validations.passwordLength(state.password)
    }

    render () {
        return (
            <Form>
              <FormGroup bsSize="large" controlId="formEmail">
                <Col componentClass={ControlLabel} sm={2}>
                  { Strings.login.email }
                </Col>
                <Col sm={10}>
                  <FormControl
                    name="email"
                    onChange={ this.handleInputChange }
                    value={ this.state.email }
                    type="email"
                    placeholder={ Strings.login.email } />
                </Col>
              </FormGroup>

              <FormGroup bsSize="large" controlId="formSigninPassword">
                <Col componentClass={ControlLabel} sm={2}>
                  { Strings.login.password }
                </Col>
                <Col sm={10}>
                  <FormControl
                    name="password"
                    value={ this.state.password }
                    onChange={ this.handleInputChange }
                    type="password"
                    placeholder={ Strings.login.password } />
                </Col>
              </FormGroup>

            </Form>
        )
    }
}
