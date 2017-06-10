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
        this.setState({[e.target.name]: e.target.value})
    }

    handleSubmit = (e) => {
        const {email, password} = this.state
        e.preventDefault()

        this.setState({
            errorMessage: null,
            loading: true
        })

        fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        }).then((response) => {
            return response.json()
        }).then( (responseBody) => {
            this.setState({loading: false})
            if (responseStatus === 200) {
                this.props.onSignin({email, password})
            }
        })
    }

    isValid () {
        return validations.email(this.state.email)
            && validations.passwordLength(this.state.password)
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

              <FormGroup>
                <Col smOffset={2}>
                  <Button
                    onClick={ this.handleSubmit }
                    type="submit"
                    disabled={ !this.isValid() }
                    >
                    { Strings.login.signin }
                  </Button>
                </Col>
                <Col style={ {color: 'red' } } sm={10}>
                  <FormControl.Static validationState="error">
                     Strings.login.errors[this.state.errorMessage] || this.state.errorMessage }
                  </FormControl.Static>
                </Col>

              </FormGroup>
            </Form>
        )
    }
}
