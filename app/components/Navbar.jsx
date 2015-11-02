import _ from 'lodash';
import LoginActions from '../actions/LoginActions';
import LoginStore from '../stores/LoginStore';
import React from 'react';
import AddPlant from './plant/AddPlant';
// import AddPlantNote from './plant/AddPlantNote';
// import Auth from './Auth';
import Help from './Help';
import Home from './Home';
import Login from './auth/Login';
import Profile from './Profile';
import ReactDOM from 'react-dom';

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

  routeClick(route) {
    const content = document.getElementById('content');
    switch(route) {
    case 'home':
      return ReactDOM.render(<Home />, content);
    case 'profile':
      return ReactDOM.render(<Profile />, content);
    case 'login':
      return ReactDOM.render(<Login />, content);
    case 'help':
      return ReactDOM.render(<Help />, content);
    case 'add-plant':
      return ReactDOM.render(<AddPlant />, content);
    default:
      return ReactDOM.render(<Home />, content);
    }
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
              <a onClick={this.routeClick.bind(this, 'home')} title='Home'>Home</a>
            </li>
            {displayName &&
              <li className='btn header-btn'>
                <a onClick={this.routeClick.bind(this, 'add-plant')} title='Add Plant'>Add</a>
              </li>
            }
            <li className='btn header-btn'>
              <a onClick={this.routeClick.bind(this, 'help')} title='Help'>Help</a>
            </li>
            {displayName &&
              <li className='btn header-btn'>
                <a onClick={this.routeClick.bind(this, 'profile')} title={displayName}>{displayName}</a>
              </li>
            }
            {displayName &&
              <li className='btn header-btn'>
                <a onClick={this.logout} title='Logout'>Logout</a>
              </li>
            }
            {!displayName &&
              <li className='btn header-btn'>
                <a onClick={this.routeClick.bind(this, 'login')} title='Login'>Login</a>
              </li>
            }
          </ul>
        </div>
      </div>
    );
  }
}
