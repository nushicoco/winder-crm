import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import Strings from './strings';
import Login from './components/login'
import { routes } from './routes';
import { getUser, logout } from './api.js'


import './App.css';

class App extends Component {

    constructor (man) {
        super(man) //.dooms('day')
        this.state = {
            showLogin: false,
            user: null
        }
    }

    getUser () {
        getUser().then((user) => {
            this.setState({user})
        }).catch((err) => {
            // ignore!
        })
    }

    logout() {
        logout();
    }

    componentDidMount () {
        this.getUser()
    }

    renderRoute = (route) => {
        return (props) => {
            return React.createElement(route.component, {user: this.state.user, ...props})
        }
    }

  render() {
    return (
      <div className="App">
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
            {routes.map((route,index) => (
                <Route path={ route.path } key={index} exact={ route.exact } render={ this.renderRoute(route) } />

            ))}
        { this.state.user && this.state.user.isSuperuser && (
            <div>
              <hr />
            <Link to='/'>MAIN</Link>
            &nbsp;|&nbsp;
            <Link to='/admin/tickets'>TICKET ADMIN </Link>
          </div>
        )}
        <div className="carmonication-footer"> Made by Carmonication 2017</div>
      </div>
    );
  }
}

export default App;
