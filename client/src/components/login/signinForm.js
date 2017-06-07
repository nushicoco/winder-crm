import React, { Component } from 'react'
import { Button, Tab, Row, Col, Nav, NavItem, FormControl, ControlLabel, Form, FormGroup } from 'react-bootstrap'

import Strings from './strings.js'
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
        this.setState({[e.target.name]: e.target.value})
    }

    isValid () {
        return validations.email(this.state.email)
            && validations.passwordLength(this.state.password)
    }

    render () {
        return (
            <Form>
              <FormGroup controlId="formEmail">
                <Col componentClass={ControlLabel} sm={2}>
                  { Strings.loginEmail }
                </Col>
                <Col sm={10}>
                  <FormControl
                    name="email"
                    onChange={ this.handleInputChange }
                    value={ this.state.email }
                    type="email"
                    placeholder={ Strings.loginEmail } />
                </Col>
              </FormGroup>

              <FormGroup controlId="formSigninPassword">
                <Col componentClass={ControlLabel} sm={2}>
                  { Strings.loginPassword }
                </Col>
                <Col sm={10}>
                  <FormControl
                    name="password"
                    value={ this.state.password }
                    onChange={ this.handleInputChange }
                    type="password"
                    placeholder={ Strings.loginPassword } />
                </Col>
              </FormGroup>

              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Button
                    onClick={ this.handleSignin }
                    type="submit"
                    disabled={ !this.isValid() }
                    >
                    { Strings.signin }
                  </Button>
                </Col>
              </FormGroup>
            </Form>
        )
    }
}
