// For the user to manage their Locations (Orchards/Yards)

const React = require('react');
// const RadioButton = require('material-ui/RadioButton').RadioButton;
// const RadioButtonGroup = require('material-ui/RadioButton').RadioButtonGroup;
const PropTypes = require('prop-types');

function userLocations(props) {
  // const styles = {
  //   radioGroup: {
  //     display: 'flex',
  //   },
  //   radioButton: {
  //     marginBottom: 16,
  //     width: 'inherit',
  //   },
  // };

  return (
    <div>
      {
        props.locations.map(location => (
          <div key={location._id}>
            {`Location: ${location.title}`}
            <h5>{'Users'}</h5>
            {
              location.users.map(user => (
                <div key={user._id}>
                  {`${user.name} - ${user.role}`}
                </div>
              ))
            }
          </div>
          ))
      }
    </div>
  );
}

userLocations.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
};

module.exports = userLocations;
