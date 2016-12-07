// Used to show a list of plants for a user.
// Url: /plants/<optional-user-id>
// Now it redirects to a Location owned by the user
// Redirect: /location/slug/_location_id

const React = require('react');
const store = require('../../store');
const utils = require('../../libs/utils');
const Immutable = require('immutable');

class Plants extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    const userId = this.props.params && this.props.params.id;
    let fwdUrl = '/';
    if(userId) {
      const user = store.getState().getIn(['users', userId], Immutable.Map());
      const locationIds = user.get('locationIds', Immutable.List());
      if(locationIds.size) {
        const locationId = locationIds.get(0);
        const location = store.getState().getIn(['locations', locationId]);
        if(location) {
          const title = location.get('title', '');
          fwdUrl = `/location/${utils.makeSlug(title)}/${locationId}`;
        } else {
          console.warn('No location found', locationId);
        }
      } else {
        const slug = utils.makeSlug(user.get('name', 'unknown-gardener'));
        fwdUrl = `/locations/${slug}/${userId}`;
        // console.warn('No locationIds found', store.getState().getIn(['users', userId], Immutable.Map()).toJS());
      }
    } else {
      console.warn('No params.id', this.props);
    }

    this.context.router.push(fwdUrl);
  }

  render() {
    return (
      <div>
        {'Should have forwarded....'}
      </div>
    );
  }
}

Plants.propTypes = {
  params:  React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
  }).isRequired,
};

module.exports = Plants;
