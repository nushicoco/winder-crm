import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types'

import { routes } from './routes';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={ process.env.PUBLIC_URL + '/img/logo_alpha.png'} className="App-logo" alt="logo" />
        </div>
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
