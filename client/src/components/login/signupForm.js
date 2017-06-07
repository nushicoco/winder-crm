import React, { Component } from 'react'
import { Button, Tab, Row, Col, Nav, NavItem, FormControl, ControlLabel, Form, FormGroup } from 'react-bootstrap'

import Strings from './strings.js'
import validations from './validations.js'

export default class SignupForm extends Component {

    constructor (props) {
        super(props)
        this.state = {
            name: '',
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

    renderField ({name, type='text', stringName}) {
        return (
            <FormGroup controlId={ name }>
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

    render () {
        return (
            <Form>

              { this.renderField({name: 'fullname',  stringName: 'loginFullname'}) }
              { this.renderField({name: 'email',     stringName: 'loginEmail',      type: 'email'}) }
              { this.renderField({name: 'password',  stringName: 'loginPassword',   type: 'password'}) }
              { this.renderField({name: 'password2', stringName: 'loginPassword2',  type: 'password'}) }

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
