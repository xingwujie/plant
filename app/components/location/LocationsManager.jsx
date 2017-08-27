// For the user to manage their Locations (Orchards/Yards)

const React = require('react');
// const RadioButton = require('material-ui/RadioButton').RadioButton;
// const RadioButtonGroup = require('material-ui/RadioButton').RadioButtonGroup;
const PropTypes = require('prop-types');
const Paper = require('material-ui/Paper').default;
const LocationsManagerGrid = require('./LocationsManagerGrid');

const userColumns = [{
  title: 'Name',
  type: 'text',
  width: 50,
}, {
  options: ['owner', 'manager', 'member'],
  title: 'Role',
  type: 'select',
  width: 50,
}];

const weatherColumns = [{
  title: 'Station ID',
  type: 'text',
  width: 33,
}, {
  title: 'Name',
  type: 'text',
  width: 33,
}, {
  title: 'Enabled',
  type: 'text',
  width: 33,
}];

function userLocations(props) {
  const paperStyle = {
    padding: 20,
    width: '100%',
    margin: 20,
    display: 'inline-block',
  };

  const locations = props.locations.toJS();

  const getUsers = users => (users || []).map((user) => {
    const { _id, name, role } = user;
    return {
      _id,
      values: [name, role],
    };
  });

  const getWeather = stations => (stations || []).map((station) => {
    const { _id, stationId, name, disabled } = station;
    return {
      _id,
      values: [stationId, name, disabled],
    };
  });

  function deleteUserRow(data) {
    // eslint-disable-next-line no-console
    console.log('LoationsManager.deleteUserRow', data);
  }

  function deleteWeatherRow(data) {
    // eslint-disable-next-line no-console
    console.log('LoationsManager.deleteWeatherRow', data);
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
            <LocationsManagerGrid
              deleteRow={deleteUserRow}
              columns={userColumns}
              rows={getUsers(location.users)}
              title={'Users'}
            />
            <LocationsManagerGrid
              deleteRow={deleteWeatherRow}
              columns={weatherColumns}
              rows={getWeather(location.weatherStations)}
              title={'Weather Stations'}
            />
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
