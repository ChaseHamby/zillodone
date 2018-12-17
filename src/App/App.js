import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import connection from '../helpers/data/connection';
import Auth from '../components/Auth/auth';
import Listings from '../components/Listings/listings';
import Buildings from '../components/Buildings/buildings';
import ListingForm from '../components/ListingForm/listingform';
import MyNavbar from '../components/MyNavbar/myNavbar';
import listingRequests from '../helpers/data/listingRequests';
import './App.scss';
import authRequests from '../helpers/data/authRequests';

class App extends Component {
  state = {
    authed: false,
    listings: [],
  }

  componentDidMount() {
    connection();
    listingRequests.getRequest()
      .then((listings) => {
        this.setState({ listings });
      })
      .catch(err => console.error('error with listing GET', err));

    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
        });
      } else {
        this.setState({
          authed: false,
        });
      }
    });
  }

  // ^^^ Doesn't require user to login again on refresh if they are already logged in

  componentWillUnmount() {
    this.removeListener();
  }

  isAuthenticated = () => {
    this.setState({ authed: true }); // changes the state above
  }

  render() {
    const logoutClickEvent = () => {
      authRequests.logoutUser();
      this.setState({ authed: false });
    };

    if (!this.state.authed) {
      return (
        <div className="App">
          <MyNavbar isAuthed={this.state.authed} logoutClickEvent={logoutClickEvent} />
          <div className="row">
            <Auth isAuthenticated={this.isAuthenticated}/>
          </div>
        </div>
      );
    }
    return (
      <div className="App">
        <MyNavbar isAuthed={this.state.authed} logoutClickEvent={logoutClickEvent} />
        <div className="row">
          <Listings />
          <Listings listings={this.state.listings}/>
          <Buildings />
        </div>
        <div className="row">
          <ListingForm />
        </div>
      </div>
    );
  }
}

export default App;
