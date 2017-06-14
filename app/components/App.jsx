const React = require('react');
const actions = require('../actions');
const PropTypes = require('prop-types');

class App extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { store } = this.context;
    const users = store.getState().get('users');
    if (!users || users.size === 0) {
      store.dispatch(actions.loadUsersRequest());
    }

    const locations = store.getState().get('locations');
    if (!locations || locations.size === 0) {
      store.dispatch(actions.loadLocationsRequest());
    }

    // const user = store.getState().get('user');
    // if(user && user.get('isLoggedIn', false)) {
    //   const locationIds = user.get('locationIds');
    //   if(!locationIds) {
    //     const userId = user.get('_id');
    //     store.dispatch(actions.loadLocationsRequest(userId));
    //   }
    // }
  }

  render() {
    return (
      <div className="react-root">
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.object.isRequired,
};

module.exports = App;
