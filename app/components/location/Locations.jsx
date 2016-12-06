// Used to show a list of locations.
// Url: /locations
// or the locations for a specific user
// Url: /locations/<user-name>/<_user_id>

const Base = require('../Base');
const React = require('react');

class Locations extends React.Component {
  render() {
    return (
      <Base>
        <div>
          {'Locations'}
        </div>
      </Base>
    );
  }
}

Locations.propTypes = {
  params:  React.PropTypes.shape({
    id: React.PropTypes.string,
    slug: React.PropTypes.string,
  }),
};

module.exports = Locations;
