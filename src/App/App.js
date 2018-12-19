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
    isEditing: false,
    editId: '-1',
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

  componentWillUnmount() {
    this.removeListener();
  }

  isAuthenticated = (username) => {
    this.setState({ authed: true, github_username: username });
  }

  deleteOne = (listingId) => {
    listingRequests.deleteListing(listingId)
      .then(() => {
        listingRequests.getRequest()
          .then((listings) => {
            this.setState({ listings });
          });
      })
      .catch(err => console.error('error with delete single', err));
  }

  formSubmitEvent = (newListing) => {
    const { isEditing, editId } = this.state;
    if (isEditing) {
      listingRequests.putRequest(editId, newListing)
        .then(() => {
          listingRequests.getRequest()
            .then((listings) => {
              this.setState({ listings, isEditing: false, editId: '-1' });
            });
        })
        .catch(err => console.error('error with listings post', err));
    } else {
      listingRequests.postRequest(newListing)
        .then(() => {
          listingRequests.getRequest()
            .then((listings) => {
              this.setState({ listings });
            });
        })
        .catch(err => console.error('error with listings post', err));
    }
  }

  passListingToEdit = listingId => this.setState({ isEditing: true, editId: listingId });

  render() {
    const {
      authed,
      listings,
      isEditing,
      editId,
    } = this.state;

    const logoutClickEvent = () => {
      authRequests.logoutUser();
      this.setState({ authed: false, github_username: '' });
    };

    // {!authed} means {this.state.authed}

    if (!authed) {
      return (
        <div className="App">
          <MyNavbar isAuthed={!authed} logoutClickEvent={logoutClickEvent} />
          <div className="row">
            <Auth isAuthenticated={this.isAuthenticated}/>
          </div>
        </div>
      );
    }
    return (
      <div className="App">
        <MyNavbar isAuthed={!authed} logoutClickEvent={logoutClickEvent} />
        <div className="row">
          <Listings
            listings={listings}
            deleteSingleListing={this.deleteOne}
            passListingToEdit={this.passListingToEdit}
          />
          <Buildings />
        </div>
        <div className="row">
          <ListingForm onSubmit={this.formSubmitEvent} isEditing={isEditing} editId={editId}/>
        </div>
      </div>
    );
  }
}

export default App;
