import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

import Settings from './settings'
import Login from './components/login'
import LoginContainer from './components/loginContainer'
import { routes } from './routes'
import { getUser } from './api.js'

import './App.css'

class App extends Component {
  constructor (man) {
    super(man) // .dooms('day')
    this.state = {
      showLogin: false,
      userQueryCompleted: false,
      user: null
    }
  }

  receivedUser (user) {
    this.setState({
      userQueryCompleted: true,
      showLogin: false,
      user: user
    })
  }

  componentDidMount () {
    getUser().then(user => this.receivedUser(user))
  }

  doLogin () {
    this.setState({
      showLogin: true
    })
  }

  renderRoute (route) {
    return (props) => {
      return React.createElement(route.component, {
        user: this.state.user,
        doLogin: () => this.doLogin(),
        userQueryCompleted: this.state.userQueryCompleted,
        ...props
      })
    }
  }

  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <Link to=''>
            <img src={Settings.logo} className='App-logo' alt='logo' />
          </Link>
        </div>

        <LoginContainer
          doLogin={() => this.doLogin()}
          user={this.state.user} />

        <Login
          onHide={() => { this.setState({showLogin: false}) }}
          show={this.state.showLogin}
          onLogin={user => this.receivedUser(user)} />
        {routes.map((route, index) => (
          <Route path={route.path} key={index} exact={route.exact} render={this.renderRoute(route)} />

          ))}
        <div className='carmonication-footer'> Made by Carmonication 2017</div>
      </div>
    )
  }
}

export default App
