const React = require('react');
const store = require('../store');
const actions = require('../actions');

class App extends React.Component {
  constructor() {
    super();

    const users = store.getState().get('users');
    if(!users || users.size === 0) {
      store.dispatch(actions.loadUsersRequest());
    }

    const locations = store.getState().get('locations');
    if(!locations || locations.size === 0) {
      store.dispatch(actions.loadLocationsRequest());
    }

    const user = store.getState().get('user');
    if(user && user.get('isLoggedIn', false)) {
      const locationIds = user.get('locationIds');
      if(!locationIds) {
        const userId = user.get('_id');
        store.dispatch(actions.loadLocationsRequest(userId));
      }
    }
  }

  render() {
    return (
      <div className='react-root'>
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.object,
};

module.exports = App;
