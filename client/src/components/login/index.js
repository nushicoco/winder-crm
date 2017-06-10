import React, { Component } from 'react'
import { Button, Modal, Tab, Row, Col, Nav, NavItem } from 'react-bootstrap'

      import      SignupForm        from      './signupForm.js'
    import          SigninForm    from          './signinForm.js'
  import              Strings   from               '../../strings.js'
import                                                './login.css'

const SIGNUP_FORM = 'signup'
const SIGNIN_FORM = 'signin'
export default class Login extends Component {

    constructor (props) {
        super(props)
        this.state = {
            selectedForm: SIGNIN_FORM,
            signinState: {},
            signupState: {}
        }
    }

    doSubmit = (url, fields) => {
        this.setState({
            errorMessage: null,
            loading: true
        })
        let responseStatus

        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(fields)
        }).then((response) => {
            responseStatus = response.status
            return response.json()
        }).then( (responseBody) => {
            let failure = responseStatus !== 200

            this.setState({
                loading: false,
                errorMessage: (failure && responseBody[0].message) || ''
            })

            if (!failure) {
                this.onLogin(responseBody.user)
            }
        }).catch( (error) => {
            this.setState({
                isLoading: false,
                errorMessage: 'unknown error'
            })
        })
    }

    handleSignin = () => {
        const {email, password} = this.state.signinState
        this.doSubmit('/login', {email, password})
    }

    handleSignup = () => {
        const { firstName,
                lastName,
                email,
                password } = this.state.signupState
        this.doSubmit('/signup',{
            firstName,
            lastName,
            email,
            password })
    }

    clearError = () => {
        this.setState({
            errorMessage: ''
        })
    }

    handleSigninChange = (signinState) => {
        this.setState({signinState})
        this.clearError()
    }

    handleSignupChange = (signupState) => {
        this.setState({signupState})
        this.clearError()
    }

    switchTab = (selectedForm) => {
        this.setState({ selectedForm })
        this.clearError()
    }

    render() {
        return (
            <Modal show={ this.props.show } onHide={ this.close } className="login-box" style={ {display: this.state.user ? 'none' : 'block' } }>
              <Modal.Header closeButton>
                <Modal.Title> { Strings.login.title } </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                { Strings.login.welcome }
                <Tab.Container id="login-tabs"defaultActiveKey={ SIGNIN_FORM }>
                  <Row className="clearfix">
                    <Col sm={12} >
                      <Nav bsStyle="tabs">

                        <NavItem eventKey="signin" onSelect={ () => this.switchTab(SIGNIN_FORM) } >
                          { Strings.login.signin }
                        </NavItem>

                        <NavItem eventKey="signup" onSelect={ () => this.switchTab(SIGNUP_FORM) } >
                          { Strings.login.signup }
                        </NavItem>
                      </Nav>
                    </Col>
                    <Col sm={12}>
                      <Tab.Content animation>
                        <Tab.Pane animation={ false } eventKey="signin" >
                          <SigninForm onChange={ this.handleSigninChange } />
                        </Tab.Pane>

                        <Tab.Pane animation={ false } eventKey="signup" >
                          <SignupForm onChange={ this.handleSignupChange } />
                        </Tab.Pane>

                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </Modal.Body>
              <Modal.Footer style={ { textAlign: 'right' } }>
                { this.state.selectedForm === SIGNIN_FORM &&  (
                    <Button
                      onClick= { this.handleSignin }
                      type="submit"
                      bsStyle="primary"
                      disabled={ !this.state.signinState.valid }
                      >
                        { Strings.login.signin }
                    </Button>
                )}

                { this.state.selectedForm === SIGNUP_FORM &&  (
                    <Button
                      onClick={ this.handleSignup }
                      bsStyle="primary"
                      type="submit"
                      disabled={ !this.state.signupState.valid }
                      >
                      { Strings.login.signup }
                    </Button>
                ) }
                <div className="login-error-message" >
                { Strings.login.errors[this.state.errorMessage] || this.state.errorMessage }
            </div>
            </Modal.Footer>
                </Modal>
        )
    }
}
