// Used to show a list of users.
// Url: /users

const Base = require('../Base');
const React = require('react');
const {Link} = require('react-router');
const store = require('../../store');
const utils = require('../../libs/utils');

const {makeSlug} = utils;

class Users extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = store.getState();
  }

  updateState() {
    const users = store.getState().get('users');
    this.setState({users});
  }

  componentWillMount() {
    this.unsubscribe = store.subscribe(this.onChange);

    this.updateState();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange() {
    this.updateState();
  }

  renderUser(user) {
    const _id = user.get('_id');
    const userName = user.get('name');
    const locationIds = user.get('locationIds');
    let link = `/locations/${makeSlug(userName)}/${_id}`;

    if(locationIds.size === 1) {
      const locations = store.getState().get('locations');
      if(locations) {
        const singleLocationId = locationIds.get(0);
        const singleLocation = locations.get(singleLocationId);
        if(singleLocation) {
          link = `/location/${makeSlug(singleLocation.get('title'))}/${singleLocationId}`;
        }
      }
    }

    return (
      <div key={_id} style={{display: 'flex', alignItems: 'center'}}>
        <Link
          style={{margin: '20px'}}
          to={link}
        >
          <span>{userName}</span>
        </Link>
      </div>
    );
  }

  renderUsers() {
    const users = store.getState().get('users');
    if(users && users.size) {
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
