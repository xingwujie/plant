// Used to show a list of users.
// Url: /users

const Base = require('../base/Base');
const React = require('react');
const { Link } = require('react-router-dom');
const utils = require('../../libs/utils');
const PropTypes = require('prop-types');

const { makeSlug } = utils;

class Users extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(this.onChange);

    this.onChange();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange() {
    const { store } = this.context;
    const users = store.getState().get('users');
    const locations = store.getState().get('locations');
    this.setState({ users, locations });
  }

  renderUser(user) {
    const _id = user.get('_id');
    const userName = user.get('name');
    const locationIds = user.get('locationIds');
    let link = `/locations/${makeSlug(userName)}/${_id}`;

    if (locationIds.size === 1) {
      const { store } = this.context;
      const locations = store.getState().get('locations');
      if (locations) {
        const singleLocationId = locationIds.first();
        const singleLocation = locations.get(singleLocationId);
        if (singleLocation) {
          link = `/location/${makeSlug(singleLocation.get('title'))}/${singleLocationId}`;
        }
      }
    }

    return (
      <div key={_id} style={{ display: 'flex', alignItems: 'center' }}>
        <Link
          style={{ margin: '20px' }}
          to={link}
        >
          <span>{userName}</span>
        </Link>
      </div>
    );
  }

  renderUsers() {
    const { store } = this.context;
    const users = store.getState().get('users');
    if (users && users.size) {
      return users.valueSeq().toArray().map(user => this.renderUser(user));
    }
    return null;
  }

  render() {
    return (
      <Base>
        <div>
          {this.renderUsers()}
        </div>
      </Base>
    );
  }
}

Users.propTypes = {
};

module.exports = Users;
