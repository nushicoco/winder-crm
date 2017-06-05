import React, { Component } from 'react';
import FrequentProblemsList from './components/frequent_problems_list/frequent_problems_list'
import Search from './components/search/search'
import Footer from './components/footer/footer'
import logo from './logo.svg';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Winder CRM</h2>
        </div>
          <div>
              <Search></Search>
              <h1>תקלות נפוצות</h1>
              <FrequentProblemsList></FrequentProblemsList>
              <Footer/>
          </div>
      </div>
    );
  }
}

export default App;
