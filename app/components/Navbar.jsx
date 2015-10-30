import _ from 'lodash';
import LoginActions from '../actions/LoginActions';
import LoginStore from '../stores/LoginStore';
import React from 'react';
// import Router from 'react-router';

// var {Link} = Router;

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
          <ul className='nav navbar-nav navbar-right' id='menu'>
            <li className='btn header-btn'>
              <a to={`/`} title='home'>Home</a>
            </li>
            {displayName &&
              <li className='btn header-btn'>
                <a to={`/add-plant`} title='add plant'>Add</a>
              </li>
            }
            <li className='btn header-btn'>
              <a to={`/help`} title='help'>Help</a>
            </li>
            {displayName &&
              <li className='btn header-btn'>
                <a to={`/profile`} title='help'>{displayName}</a>
              </li>
            }
            {displayName &&
              <li className='btn header-btn'>
                <a href='' onClick={this.logout}>Logout</a>
              </li>
            }
            {!displayName &&
              <li className='btn header-btn'>
                <a to={`/login`}>Login</a>
              </li>
            }
          </ul>
        </div>
      </div>
    );
  }
}
