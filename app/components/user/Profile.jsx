const Base = require('../Base');
const React = require('react');
const RadioButton = require('material-ui/RadioButton').RadioButton;
const RadioButtonGroup = require('material-ui/RadioButton').RadioButtonGroup;
const UserLocations = require('./UserLocations');
const PropTypes = require('prop-types');

// Responsible for:
// 1. Current user: /profile
// 2. Other user: /profile/slug/<id>
// Only implmenting #1 for now.

function profile(props) {
  const styles = {
    radioGroup: {
      display: 'flex',
    },
    radioButton: {
      marginBottom: 16,
      width: 'inherit',
    },
  };

  const { userSettings } = props;
  const { imperial } = userSettings;

  const unitOfMeasurement = imperial ? 'imperial' : 'metric';

  return (
    <Base>
      <div>
        <h2 style={{ textAlign: 'center' }}>
          User Profile
        </h2>
        <h3>{'Unit of Measurement'}</h3>
        <RadioButtonGroup
          defaultSelected={unitOfMeasurement}
          name="unitOfMeasurement"
          style={styles.radioGroup}
        >
          <RadioButton
            label="Imperial"
            style={styles.radioButton}
            value="imperial"
          />
          <RadioButton
            label="Metric"
            style={styles.radioButton}
            value="metric"
          />
        </RadioButtonGroup>
        <h3>{'Locations'}</h3>
        <UserLocations locations={props.locations} />
      </div>
    </Base>
  );
}

profile.propTypes = {
  locations: UserLocations.propTypes.locations,
  userSettings: PropTypes.shape({
    imperial: PropTypes.bool,
  }),
};

profile.defaultProps = {
  userSettings: {
    imperial: true,
  },
  locations: [{
    _id: 'location-1',
    title: 'Location #1',
    users: [{
      _id: 'user-1',
      name: 'John Smith',
      role: 'owner',
    }],
  }],
};

module.exports = profile;
