import React, { Component } from 'react';
import PropTypes from 'prop-types'


// import logo from './logo.svg';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src="http://res.cloudinary.com/dzbelv6cv/image/upload/c_scale,w_500/v1496912076/assets/logo_alpha.png" className="App-logo" alt="logo" />
        </div>
      </div>
    );
  }
}

App.contextTypes = {
    mixpanel: PropTypes.object.isRequired
};

export default App;