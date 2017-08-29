// For the user to manage their Locations (Orchards/Yards)

const actions = require('../../actions');
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
   * Called with a save on an edit/new is done. Validation is failed by returning an
   * array that has at least 1 truthy value in it.
   * @param {Object} data.row - The row that is being validated
   * @param {string} data.row._id - The _id of the row which is the user's _id
   * @param {any[]} data.row.values - The values being changed/inserted
   * @param {Object} data.meta - Meta data sent to Grid for passing back container methods
   * @param {Object} data.meta.location - The location object that this applies to
   * @param {Object[]} data.meta.location.users - The users at this location
   * @param {string} data.meta.location.users[]._id - The _id of the user
   * @param {string} data.meta.location.users[].role - The _id of the user
   * @param {boolean} data.isNew - True if this is a new row
   */
  static validateLocationUser({ row, meta, isNew }) {
    const { values, _id } = row;

    // Check that each of the Select components has a value selected
    const errors = values.map(value => (value === '<select>' ? 'You must select a value' : ''));

    // For an insert, check that the user is not already listed at the location
    if (isNew) {
      const { location } = meta;
      if (location.users.some(user => user._id === _id)) {
        errors[0] = 'This user already belongs to this location';
      }
    }

    return errors;
  }

  static validateLocationWeather({ row, meta, isNew }) {
    const { values } = row;
    const errors = [];
    errors[0] = (values[0] || '').length < 1
      ? 'Station ID must be at least 1 character'
      : '';
    errors[1] = (values[1] || '').length < 1
      ? 'Station Name must be at least 1 character'
      : '';
    errors[2] = '';

    // For an insert, check that the stationId is not already listed at the location
    if (isNew) {
      const { location } = meta;
      const { weatherStations = [] } = location;
      if ((weatherStations || []).some(station => station.stationId === values[0])) {
        errors[0] = 'This Station ID already belongs to this location';
      }
      if ((weatherStations || []).some(station => station.name === values[1])) {
        errors[1] = 'This Name already used';
      }
    }

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

  insertLocationUser({ row, meta }) {
    // eslint-disable-next-line no-console
    console.log('LocationsManager.insertLocationUser()', row, meta, this.props);
    // const users = location.users;
    // To insert a new user for a location we need 3 things on the client side:
    // locationId, userId, role
    // On the server we also need the logged-in user to verify that they are an
    // owner of that location and therefore authorized.
    this.props.dispatch(actions.insertLocationUser(row));
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
                meta={{ location }}
                rows={getUsers(location.users)}
                title={'Users'}
                update={this.updateLocationUser}
                validate={LocationsManager.validateLocationUser}
              />
              <Grid
                columns={weatherColumns}
                delete={this.deleteLocationWeather}
                insert={this.insertLocationWeather}
                meta={{ location }}
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
  dispatch: PropTypes.func.isRequired,
  locations: PropTypes.shape({
    toJS: PropTypes.func.isRequired,
  }).isRequired,
  users: PropTypes.shape({
    reduce: PropTypes.func.isRequired,
  }).isRequired,
};

module.exports = LocationsManager;
