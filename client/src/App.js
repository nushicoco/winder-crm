import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import Login from './components/login'
import LoginContainer from './components/loginContainer'
import { routes } from './routes';
import { getUser, getTickets } from './api.js'


import './App.css';

class App extends Component {

    constructor (man) {
        super(man) //.dooms('day')
        this.state = {
            showLogin: false,
            user: null
        }
    }
    receivedUser = (user) => {
        this.setState({
            showLogin: false,
            user
        })

        getTickets().then((tickets) => {
            this.setState({ticketsCount: tickets.length });
        })
    }

    componentDidMount () {
        getUser().then(this.receivedUser)
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
            <Link to="">
              <img src={ process.env.PUBLIC_URL + '/img/logo_alpha.png'} className="App-logo" alt="logo" />
            </Link>
          </div>

          <LoginContainer
            onLogin = { () => this.setState({showLogin: true})}
            user={ this.state.user }/>

          <Login
              onHide={ () => { this.setState({showLogin: false}) } }
              show={this.state.showLogin}
              onLogin={ this.receivedUser } />
            {routes.map((route,index) => (
                <Route path={ route.path } key={index} exact={ route.exact } render={ this.renderRoute(route) } />

            ))}
        <div className="carmonication-footer"> Made by Carmonication 2017</div>
      </div>
    );
  }
}

export default App;
