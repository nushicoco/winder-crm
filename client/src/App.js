import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { routes } from './routes';
import Login from './components/login'
import { getUser, logout } from './api.js'
import Strings from './strings';
import { Button } from 'react-bootstrap';

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
        // todo - redirect after logout
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
        { this.state.user && (
            <div>{Strings.header.welcome}, {this.state.user.firstName} !<a className="inline" href="#" onClick={() => this.logout()}>{Strings.header.logout}</a></div>
        )}
        { !this.state.user && (
            <div>{Strings.header.loginHeader} <a className="inline" href="#" onClick={() => this.setState({showLogin: true})} ><Button bsStyle="primary">{Strings.header.loginAction}</Button></a></div>
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

      </div>
    );
  }
}

App.contextTypes = {
    mixpanel: PropTypes.object.isRequired
};

export default App;
