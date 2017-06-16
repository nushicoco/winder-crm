import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { routes } from './routes';
import { getUser } from './api.js'

import './App.css';
import Header from "./components/header/header";

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
        <Header user={this.state.user}/>
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

export default App;
