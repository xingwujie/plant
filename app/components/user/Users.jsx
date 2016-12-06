// Used to show a list of users.
// Url: /users

const Base = require('../Base');
const React = require('react');

class Users extends React.Component {
  render() {
    return (
      <Base>
        <div>
          {'Users'}
        </div>
      </Base>
    );
  }
}

Users.propTypes = {
};

module.exports = Users;
