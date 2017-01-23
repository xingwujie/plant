// Used to show a list of locations.
// Url: /locations
// or the locations for a specific user
// Url: /locations/<user-name>/<_user_id>

const Base = require('../Base');
const React = require('react');
const {Link} = require('react-router');
const utils = require('../../libs/utils');
const Immutable = require('immutable');
const AddLocationButton = require('./AddLocationButton');

const {makeSlug} = utils;

class Locations extends React.Component {
  static contextTypes = {
    store: React.PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  updateState() {
    const {store} = this.context;
    const locations = store.getState().get('locations');
    const users = store.getState().get('users');
    this.setState({locations, users});
  }

  componentWillMount() {
    const {store} = this.context;
    this.unsubscribe = store.subscribe(this.onChange);

    this.updateState();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange() {
    this.updateState();
  }

  renderLocation(location) {
    if(!location) {
      return null;
    }

    const _id = location.get('_id');
    const title = location.get('title');
    const link = `/location/${makeSlug(title)}/${_id}`;

    return (
      <div key={_id} style={{display: 'flex', alignItems: 'center'}}>
        <Link
          style={{margin: '20px'}}
          to={link}
        >
          <span>{title}</span>
        </Link>
      </div>
    );
  }

  isOwner(user) {
    const {store} = this.context;
    const authUser = store.getState().get('user', Immutable.Map());
    return !!(user && authUser.get('_id') === user.get('_id'));
  }

  renderTitle(title) {
    return (
      <h2 style={{textAlign: 'center'}}>{`${title}`}</h2>
    );
  }

  renderNoLocations(user) {
    return (
      <div>
        {this.renderTitle(user.get('name'))}
        <h3 style={{textAlign: 'center'}}>
          <div style={{marginTop: '100px'}}>{'No locations added yet...'}</div>
          <AddLocationButton
            show={this.isOwner(user)}
            style={{marginTop: '10px'}}
          />
        </h3>
      </div>
    );
  }

  renderLocations() {
    const {store} = this.context;
    const locations = store.getState().get('locations');
    if(!locations || !locations.size) {
      return null;
    }

    const {params} = this.props;
    if(params && params.id) {
      const user = store.getState().getIn(['users', params.id], Immutable.Map());
      const locationIds = user.get('locationIds', Immutable.List());
      if(locationIds.size) {
        return locationIds.valueSeq().toArray().map(locationId => {
          const location = locations.get(locationId);
          this.renderLocation(location);
        });
      } else {
        return this.renderNoLocations(user);
      }
    } else {
      return locations.valueSeq().toArray().map(location => this.renderLocation(location));
    }
  }

  render() {
    return (
      <Base>
        <div>
          {this.renderLocations()}
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
