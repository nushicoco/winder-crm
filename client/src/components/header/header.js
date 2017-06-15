/**
 * Created by einavcarmon on 15/06/2017.
 */
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Strings from '../../strings';
import Login from '../login'
import { logout } from '../../api.js'

import './header.css'

export default class Header extends Component {

    constructor (props) {
        super(props);

        this.state = {
            user: props.user
        }
    }

    logout() {
        logout();
    }

    render () {
        return (
            <div>
                <div className="App-header">
                    <img src={ process.env.PUBLIC_URL + '/img/logo_alpha.png'} className="App-logo" alt="logo" />
                </div>
                { !this.state.user && (
                    <div className="login-container"> {Strings.header.loginHeader}
                        <a className="inline" href="#" onClick={() => this.setState({showLogin: true})} >
                            <Button bsStyle="primary"> { Strings.header.loginAction } </Button>
                        </a>
                    </div>
                )}

                { this.state.user && (
                    <div className="login-container">
                        <p className="inline logged-in-header">{Strings.header.welcome}, {this.state.user.firstName} !</p> <span>
                        <a className="inline logout-header" href="#" onClick={() => this.logout()}>{Strings.header.logout}</a></span>
                    </div>
                )}

                <Login
                    onHide={ () => { this.setState({showLogin: false}) } }
                    show={this.state.showLogin}
                    onLogin={ (user) => {
                        this.setState({
                            showLogin: false,
                            user
                        })
                    }}
                />
            </div>
        );
    }
}


