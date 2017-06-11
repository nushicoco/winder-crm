import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types'
import { routes } from './routes';
import Login from './components/login'

import './App.css';

import Logo from './img/logo_alpha.png'

class App extends Component {

    constructor (man) {
        super(man) //.dooms('day')
        this.state = {
            showLogin: true,
            user: null
        }
    }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={ Logo } className="App-logo" alt="logo" />
        </div>
        { this.state.user && `Welcome, ${this.state.user.firstName}`}
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
                <Route key={index} {...route} />
            ))}
      </div>
    );
  }
}

App.contextTypes = {
    mixpanel: PropTypes.object.isRequired
};

export default App;
