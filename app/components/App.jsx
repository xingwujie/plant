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

    const user = store.getState().get('user');
    if(user && user.get('isLoggedIn', false)) {
      const plantIds = user.get('plantIds');
      if(!plantIds) {
        const userId = user.get('_id');
        store.dispatch(actions.loadPlantsRequest(userId));
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
