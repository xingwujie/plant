const Base = require('../Base');
const React = require('react');
const RadioButton = require('material-ui/RadioButton').RadioButton;
const RadioButtonGroup = require('material-ui/RadioButton').RadioButtonGroup;

// Responsible for:
// 1. Current user: /profile
// 2. Other user: /profile/slug/<id>
// Only implmenting #1 for now.

class Profile extends React.Component {

  render() {
    const styles = {
      radioGroup: {
        display: 'flex',
      },
      radioButton: {
        marginBottom: 16,
        width: 'inherit',
      },
    };

    const unitOfMeasurement = 'imperial';

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
            onChange={this.onChange}
            style={styles.radioGroup}
          >
            <RadioButton
              disabled
              label="Imperial"
              style={styles.radioButton}
              value="imperial"
            />
            <RadioButton
              disabled
              label="Metric"
              style={styles.radioButton}
              value="metric"
            />
          </RadioButtonGroup>
          <h3>{'Locations'}</h3>
        </div>
      </Base>
    );
  }
}

module.exports = Profile;
