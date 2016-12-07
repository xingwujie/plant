// Used to show a list of locations.
// Url: /locations
// or the locations for a specific user
// Url: /locations/<user-name>/<_user_id>

const Base = require('../Base');
const React = require('react');
const {Link} = require('react-router');
const store = require('../../store');
const utils = require('../../libs/utils');
const Immutable = require('immutable');

const {makeSlug} = utils;

class Locations extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = store.getState();
  }

  updateState() {
    const locations = store.getState().get('locations');
    this.setState({locations});
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

  renderLocations() {
    const locations = store.getState().get('locations');
    if(!locations || !locations.size) {
      return null;
    }

    const {params} = this.props;
    if(params && params.id) {
      const locationIds = store.getState().getIn(['users', params.id, 'locationIds'], Immutable.List());
      return locationIds.valueSeq().toArray().map(locationId => {
        const location = locations.get(locationId);
        this.renderLocation(location);
      });
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
