import React, { Component } from 'react'
import { Button, Col, FormControl, ControlLabel, Form, FormGroup } from 'react-bootstrap'
import LoadingSpinner from './loadingSpinner.js'

import Strings from './strings.js'
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
        this.setState({loading: true})
        e.preventDefault()
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
            // TODO something...
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
                { Strings[stringName] }
              </Col>
              <Col sm={10}>
                <FormControl
                  name={name}
                  onChange={ this.handleInputChange }
                  value={ this.state[name] }
                  type={ type }
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
              <LoadingSpinner show={ this.state.loading } />

              { this.renderField({name: 'firstName', stringName: 'loginFirstName',validator: validations.name}) }
              { this.renderField({name: 'lastName',  stringName: 'loginLastName', validator: validations.name}) }
              { this.renderField({name: 'email',     stringName: 'loginEmail',    validator: validations.email,  type: 'email'}) }
              { this.renderField({name: 'password',  stringName: 'loginPassword', validator: validations.passwordLength, type: 'password'}) }
              { this.renderField({name: 'password2', stringName: 'loginPassword2',validator: this.password2validator, type: 'password'}) }

              <FormGroup>
                <Col smOffset={2} sm={10}>
                  <Button
                    onClick={ this.handleSubmit }
                    type="submit"
                    disabled={ !this.isValid() }
                    >
                    { Strings.signin }
                  </Button>
                </Col>
              </FormGroup>
              <div >
                { this.state.errorMessage }
              </div>
            </Form>
        )
    }
}
