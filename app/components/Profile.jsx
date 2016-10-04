const Base = require('./Base');
const React = require('react');

// Responsible for:
// 1. Current user: /profile
// 2. Other user: /profile/slug/<id>
// Only implmenting #1 for now.

class Profile extends React.Component {

  render() {
    return (
      <Base>
        <h2 style={{textAlign: 'center'}}>
          User Profile
        </h2>
      </Base>
    );
  }
}

module.exports = Profile;
