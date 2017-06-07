import React, { Component } from 'react'
import { Tab, Row, Col, Nav, NavItem } from 'react-bootstrap'

import LoadingSpinner from './loadingSpinner.js'
import SignupForm from './signupForm.js'
import SigninForm from './signinForm.js'
import Strings from './strings.js'
import './login.css'


export default class Login extends Component {

    constructor (props) {
        super(props)
        this.state = {
        }
    }

    handleInputChange = (e) => {
        let newState = Object.assign({}, this.state, {
            [e.target.name] : e.target.value
        })
        this.setState(newState)
    }

    validateSignin = (state) => {
        return this.emailValid(state.signinEmail)
            && this.passwordValid(state.signinPassword)
    }

    validateSignup = (state) => {
        return true
    }

    handleSignin = (e) => {
        e.preventDefault()
        this.setState({ loading: true })
    }

    handleSignup = (e) => {
        e.preventDefault()
    }

    render() {
        return (
            <div className="login-box">
              <LoadingSpinner show={ this.state.loading } />
              { Strings.loginWelcome }
              <Tab.Container id="login-tabs" defaultActiveKey="signin">
                <Row className="clearfix">
                  <Col sm={12} >
                    <Nav bsStyle="tabs">

                      <NavItem eventKey="signin">
                        { Strings.signin }
                      </NavItem>

                      <NavItem eventKey="signup">
                        { Strings.signup }
                      </NavItem>
                    </Nav>
                  </Col>
                  <Col sm={12}>
                    <Tab.Content animation>
                      <Tab.Pane eventKey="signin">
                        <SigninForm onSubmit={ this.handleSignin }/>
                      </Tab.Pane>

                      <Tab.Pane eventKey="signup">
                        <SignupForm onSubmit={ this.handleSignup }/>
                      </Tab.Pane>

                    </Tab.Content>
                  </Col>
                </Row>

              </Tab.Container>
            </div>
        )
    }
}
