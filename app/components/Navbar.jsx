import _ from 'lodash';
import React from 'react';
import LoginActions from '../actions/LoginActions';
import LoginStore from '../stores/LoginStore';

export default class Navbar extends React.Component {
  constructor() {
    super();
    this.state = LoginStore.getState();
    this.onChange = this.onChange.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    LoginStore.listen(this.onChange);
  }

  componentWillUnmount() {
    LoginStore.unlisten(this.onChange);
  }

  onChange(user){
    this.setState(user);
  }

  logout() {
    LoginActions.logout();
  }

  render() {

    const displayName = _.get(this, 'state.user.name');

    return (
      <div id='header'>
        <div id='title'>
          <h1>Plant</h1>
        </div>
        <div id='menucontainer'>
          <ul id='menu'>
            <li>
              <a href='#'>Home</a>
            </li>
            <li>
              <a href='#help'>Help</a>
            </li>
            {displayName &&
              <li>{displayName}</li>
            }
            {displayName &&
              <li>
                <a href='' onClick={this.logout}>Logout</a>
              </li>
            }
            {!displayName &&
              <li>
                <a href='/auth/facebook'>Login with Facebook</a>
              </li>
            }
          </ul>
        </div>
      </div>
    );
  }
}
