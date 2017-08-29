// For the user to manage their Locations (Orchards/Yards)

const Grid = require('../common/Grid');
const Immutable = require('immutable');
const Paper = require('material-ui/Paper').default;
const PropTypes = require('prop-types');
const React = require('react');

const userColumns = [{
  title: 'Name',
  type: 'select',
  width: 50,
}, {
  options: {
    '<select>': '<select>',
    owner: 'Owner',
    manager: 'Manager',
    member: 'Member',
  },
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
  type: 'boolean',
  width: 33,
}];

const getUsers = users => (users || []).map((user) => {
  const { _id, role } = user;
  return {
    _id,
    values: [_id, role],
  };
});

const getWeather = stations => (stations || []).map((station) => {
  const { _id, stationId, name, disabled } = station;
  return {
    _id,
    values: [stationId, name, disabled],
  };
});

class LocationsManager extends React.Component {
  /**
   * 
   * @param {Object} data - for user it will be _id and owner/manager/member
   */
  static validateLocationUser({ values }) {
    return values.map(value => (value === '<select>' ? 'You must select a value' : ''));
  }

  static validateLocationWeather({ values }) {
    const errors = [];
    errors[0] = (values[0] || '').length < 1
      ? 'Station ID must be at least 1 character'
      : '';
    errors[1] = (values[1] || '').length < 1
      ? 'Station Name must be at least 1 character'
      : '';
    errors[2] = '';
    return errors;
  }

  constructor(props) {
    super(props);
    this.insertLocationUser = this.insertLocationUser.bind(this);
    this.insertLocationWeather = this.insertLocationWeather.bind(this);
    this.deleteLocationUser = this.deleteLocationUser.bind(this);
    this.deleteLocationWeather = this.deleteLocationWeather.bind(this);
    this.updateLocationUser = this.updateLocationUser.bind(this);
    this.updateLocationWeather = this.updateLocationWeather.bind(this);

    userColumns[0].options = props.users.reduce((acc, item) =>
      acc.set(item.get('_id'), item.get('name')), Immutable.Map()).toJS();
    userColumns[0].options['<select>'] = '<select>';
  }

  insertLocationUser(data) {
    // eslint-disable-next-line no-console
    console.log('LocationsManager.insertLocationUser()', data, this.props);
  }

  insertLocationWeather(data) {
    // eslint-disable-next-line no-console
    console.log('LocationsManager.insertLocationWeather()', data, this.props);
  }

  deleteLocationUser(data) {
    // eslint-disable-next-line no-console
    console.log('LocationsManager.deleteLocationUser', data, this.props);
  }

  deleteLocationWeather(data) {
    // eslint-disable-next-line no-console
    console.log('LocationsManager.deleteLocationWeather', data, this.props);
  }

  updateLocationUser(data) {
    // eslint-disable-next-line no-console
    console.log('LocationsManager.updateLocationUser', data, this.props);
  }

  updateLocationWeather(data) {
    // eslint-disable-next-line no-console
    console.log('LocationsManager.updateLocationWeather', data, this.props);
  }

  render() {
    const paperStyle = {
      padding: 20,
      width: '100%',
      margin: 20,
      display: 'inline-block',
    };

    const locations = this.props.locations.toJS();

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
              <Grid
                columns={userColumns}
                delete={this.deleteLocationUser}
                insert={this.insertLocationUser}
                rows={getUsers(location.users)}
                title={'Users'}
                update={this.updateLocationUser}
                validate={LocationsManager.validateLocationUser}
              />
              <Grid
                columns={weatherColumns}
                delete={this.deleteLocationWeather}
                insert={this.insertLocationWeather}
                rows={getWeather(location.weatherStations)}
                title={'Weather Stations'}
                update={this.updateLocationWeather}
                validate={LocationsManager.validateLocationWeather}
              />
            </Paper>
          ))
        }
      </div>
    );
  }
}

LocationsManager.propTypes = {
  locations: PropTypes.shape({
    toJS: PropTypes.func.isRequired,
  }).isRequired,
  users: PropTypes.shape({
    reduce: PropTypes.func.isRequired,
  }).isRequired,
};

module.exports = LocationsManager;
