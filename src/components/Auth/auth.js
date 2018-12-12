import React from 'react';
import authRequests from '../../helpers/data/authRequests';
import './auth.scss';

class Auth extends React.Component {
  authenticateUser = (e) => {
    e.preventDefault();
    authRequests.authenticate().then(() => {

    }).catch(err => console.error('there was an error with auth', err));
  }

  render() {
    return (
      <div className="Auth">
        <button className="btn btn-danger" onClick={this.authenticateUser}>Login</button>
      </div>
    );
  }
}

export default Auth;
