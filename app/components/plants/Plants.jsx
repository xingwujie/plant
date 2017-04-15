// Used to show a list of plants for a user.
// Url: /plants/<slug>/<optional-user-id>
// Now it redirects to a Location owned by the user
// Redirect: /location/slug/_location_id

const React = require('react');
const utils = require('../../libs/utils');
const Immutable = require('immutable');
const PropTypes = require('prop-types');

class Plants extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.redirectIfReady = this.redirectIfReady.bind(this);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange() {
    const {store} = this.context;
    const users = store.getState().get('users');
    const locations = store.getState().get('locations');
    this.setState({users, locations});
  }

  componentWillMount() {
    const {store} = this.context;
    this.unsubscribe = store.subscribe(this.onChange);
    this.onChange();
    this.redirectIfReady();
  }

  componentWillUpdate() {
    this.redirectIfReady();
  }

  redirectIfReady() {
    const {store} = this.context;
    const userId = this.props.params && this.props.params.id;
    let fwdUrl = '/';
    if(userId) {
      const user = store.getState().getIn(['users', userId], Immutable.Map());
      const locationIds = user.get('locationIds', Immutable.List());
      if(locationIds.size) {
        const locationId = locationIds.first();
        const location = store.getState().getIn(['locations', locationId]);
        if(location) {
          const title = location.get('title', '');
          fwdUrl = `/location/${utils.makeSlug(title)}/${locationId}`;
          this.context.router.push(fwdUrl);
        }
      }
    } else {
      console.warn('No params.id', this.props);
    }
  }

  render() {
    return (
      <div>
        {'Working on redirecting you to the right place...'}
      </div>
    );
  }
}

Plants.propTypes = {
  params:  PropTypes.shape({
    id: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

module.exports = Plants;
