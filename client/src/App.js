import React, { Component } from 'react';
import PropTypes from 'prop-types'


import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={ process.env.PUBLIC_URL + '/img/logo_alpha.png'} className="App-logo" alt="logo" />
        </div>
      </div>
    );
  }
}

App.contextTypes = {
    mixpanel: PropTypes.object.isRequired
};

export default App;
