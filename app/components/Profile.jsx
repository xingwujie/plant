import Base from './Base';
import React from 'react';

// Responsible for:
// 1. Current user: /profile
// 2. Other user: /profile/slug/<id>
// Only implmenting #1 for now.

export default class Profile extends React.Component {

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
