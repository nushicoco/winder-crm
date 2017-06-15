import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types'
import { routes } from './routes';
import Login from './components/login'
import { getUser } from './api.js'
import Strings from './strings';

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
        })
    }

    componentDidMount () {
        this.getUser()
    }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={ process.env.PUBLIC_URL + '/img/logo_alpha.png'} className="App-logo" alt="logo" />
        </div>
        { this.state.user && `Welcome, ${this.state.user.firstName}`}
        { !this.state.user && (
            <div><a href="#" onClick={() => this.setState({showLogin: true})} >{Strings.login.signin}</a></div>
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
                <Route key={index} {...route} />
            ))}
        { this.state.user && this.state.user.isSuperuser && (
            <div>
              <hr />
            <Link to='/'>MAIN</Link>
            &nbsp;|&nbsp;
            <Link to='/tickets-admin'>TICKET ADMIN </Link>
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
