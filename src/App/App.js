import React, { Component } from 'react';
import connection from '../helpers/data/connection';
import Auth from '../components/Auth/auth';
import './App.scss';

class App extends Component {
  componentDidMount() {
    connection();
  }
  
  render() {
    return (
      <div className="App">
        <Auth />
      </div>
    );
  }
}

export default App;
