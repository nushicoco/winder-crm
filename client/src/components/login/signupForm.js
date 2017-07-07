import React, { Component } from 'react'
import { Col, FormControl, ControlLabel, Form, FormGroup } from 'react-bootstrap'

import Strings from '../../strings'
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

  handleInputChange (e) {
    const newState = Object.assign({}, this.state, {
      [e.target.name + '_touched']: true,
      [e.target.name]: e.target.value
    })
    newState.valid = this.isValid(newState)
    this.setState(newState)
    this.props.onChange(newState)
  }

  isValid (state) {
        // TODO: DRY, somehow
    return validations.email(state.email) &&
            validations.passwordLength(state.password) &&
            state.password === state.password2 &&
            validations.name(state.firstName) &&
            validations.name(state.lastName)
  }

  renderField ({name, type = 'text', stringName, validator}) {
    return (
      <FormGroup
        validationState={this.state[name + '_touched'] && (validator(this.state[name]) ? 'success' : 'error')}
        controlId={name}>
        <Col componentClass={ControlLabel} sm={4} >
          { Strings.login[stringName] }
        </Col>
        <Col sm={8}>
          <FormControl
            name={name}
            onChange={e => this.handleInputChange(e)}
            value={this.state[name]}
            type={type}
            disabled={this.state.isLoading}
            placeholder={Strings[stringName]} />
        </Col>
      </FormGroup>

    )
  }

  password2validator (pass2) {
    return pass2 === this.state.password
  }

  render () {
    return (
      <Form>
        { this.renderField({name: 'firstName', stringName: 'firstName', validator: validations.name}) }
        { this.renderField({name: 'lastName', stringName: 'lastName', validator: validations.name}) }
        { this.renderField({name: 'email', stringName: 'email', validator: validations.email, type: 'email'}) }
        { this.renderField({name: 'password', stringName: 'password', validator: validations.passwordLength, type: 'password'}) }
        { this.renderField({name: 'password2', stringName: 'password2', validator: this.password2validator.bind(this), type: 'password'}) }
      </Form>
    )
  }
}
