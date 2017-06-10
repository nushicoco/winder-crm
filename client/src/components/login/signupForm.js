import React, { Component } from 'react'
import { Button, Col, FormControl, ControlLabel, Form, FormGroup } from 'react-bootstrap'

import Strings from '../../strings.js'
import validations from './validations.js'

export default class SignupForm extends Component {

    constructor (props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            password2: ''
        }
    }

    handleSubmit = (e) => {
        const { firstName,
                lastName,
                email,
                password } = this.state

        e.preventDefault()
        this.setState({
            isLoading: true,
            errorMessage: null
        })

        let responseStatus

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password
            })
        }).then( (response) => {
            responseStatus = response.status
            return response.json()
        }).next( (responseBody) => {
            let errorMessage = null
            if (responseStatus === 200) {
                this.props.onSignup()
                // TODO: something else when succeeding?
            }
            else {
                errorMessage = responseBody[0].message
            }
            this.setState({
                errorMessage,
                isLoading: false
            })

        }).then ( (error) => {
            this.setState({
                isLoading: false,
                errorMessage: error[0].message
            })
        }).catch( (error) => {
            this.setState({
                isLoading: false,
                errorMessage: 'unknown error'
            })
        })
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name + '_touched']: true,
            [e.target.name]: e.target.value
        })
    }

    isValid () {
        // TODO: DRY, somehow
        return validations.email(this.state.email)
            && validations.passwordLength(this.state.password)
            && this.state.password === this.state.password2
            && validations.name(this.state.firstName)
            && validations.name(this.state.lastName)
    }

    renderField ({name, type='text', stringName, validator}) {
        return (
            <FormGroup
              validationState={ this.state[name + "_touched"] && (validator(this.state[name]) ? "success" : "error") }
              controlId={ name }>
              <Col componentClass={ControlLabel} sm={2}>
                { Strings.login[stringName] }
              </Col>
              <Col sm={10}>
                <FormControl
                  name={name}
                  onChange={ this.handleInputChange }
                  value={ this.state[name] }
                  type={ type }
                  disabled={ this.state.isLoading }
                  placeholder={ Strings[stringName] } />
              </Col>
            </FormGroup>

        )
    }

    password2validator = (pass2) => {
        return pass2 === this.state.password
    }

    render () {
        return (
            <Form>
              { this.renderField({name: 'firstName', stringName: 'firstName',validator: validations.name}) }
              { this.renderField({name: 'lastName',  stringName: 'lastName', validator: validations.name}) }
              { this.renderField({name: 'email',     stringName: 'email',    validator: validations.email,  type: 'email'}) }
              { this.renderField({name: 'password',  stringName: 'password', validator: validations.passwordLength, type: 'password'}) }
              { this.renderField({name: 'password2', stringName: 'password2',validator: this.password2validator, type: 'password'}) }

              <FormGroup >
                <Col sm={2}>
                  <Button
                    onClick={ this.handleSubmit }
                    type="submit"
                    disabled={ !this.isValid() || this.state.isLoading }
                    >
                    { Strings.login.signin }
                  </Button>
                </Col>
                <Col style={ {color: 'red' } } sm={10}>
                  <FormControl.Static validationState="error">
                    { Strings.login.errors[this.state.errorMessage] || this.state.errorMessage }
                  </FormControl.Static>
                </Col>
              </FormGroup>
            </Form>
        )
    }
}
