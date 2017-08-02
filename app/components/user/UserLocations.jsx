// For the user to manage their Locations (Orchards/Yards)

const React = require('react');
// const RadioButton = require('material-ui/RadioButton').RadioButton;
// const RadioButtonGroup = require('material-ui/RadioButton').RadioButtonGroup;
const PropTypes = require('prop-types');
const Paper = require('material-ui/Paper').default;

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
  const paperStyle = {
    padding: 20,
    width: '100%',
    margin: 20,
    display: 'inline-block',
  };

  const locations = props.locations.toJS();

  function usersGrid(users) {
    return (
      <div>
        <h5>{'Users'}</h5>
        {
          (users || []).map(user => (
            <div key={user._id}>
              {`${user.name} - ${user.role}`}
            </div>
          ))
        }
      </div>
    );
  }

  function stationsGrid(stations) {
    return (
      <div>
        <h5>{'Weather Stations'}</h5>
        {
          (stations || []).map(station => (
            <div key={station._id}>
              {`${station.stationId} - ${station.name} - ${station.enabled}`}
            </div>
          ))
        }
      </div>
    );
  }

  return (
    <div>
      {
        locations.map(location => (
          <Paper
            key={location._id}
            style={paperStyle}
            zDepth={5}
          >
            <h3>{`${location.title}`}</h3>
            {usersGrid(location.users)}
            {stationsGrid(location.weatherStations)}
          </Paper>
        ))
      }
    </div>
  );
}

userLocations.propTypes = {
  locations: PropTypes.shape({
    toJS: PropTypes.func.isRequired,
  }).isRequired,
};

module.exports = userLocations;
