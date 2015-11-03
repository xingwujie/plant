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
      <nav className='navbar navbar-default'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#plant-navbar-collapse' aria-expanded='false'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            <a href='#' className='navbar-brand' onClick={this.routeClick.bind(this, 'home')} title='Plant'>Plant</a>
          </div>

          <div className='collapse navbar-collapse' id='plant-navbar-collapse'>
            <ul className='nav navbar-nav navbar-right'>
              {displayName &&
                <li>
                  <a href='#' onClick={this.routeClick.bind(this, 'add-plant')} title='Add Plant'>Add</a>
                </li>
              }
              {displayName &&
                <li className='dropdown'>
                  <a href='#' className='dropdown-toggle'
                    data-toggle='dropdown' role='button'
                    aria-haspopup='true' aria-expanded='false'
                    title={displayName}>{displayName} <span className='caret'></span>
                  </a>
                  <ul className='dropdown-menu'>
                    <li>
                      <a href='#' onClick={this.routeClick.bind(this, 'profile')} title='Profile'>Profile</a>
                    </li>
                    <li>
                      <a href='#' onClick={this.logout} title='Logout'>Logout</a>
                    </li>
                  </ul>
                </li>
              }
              {!displayName &&
                <li>
                  <a href='#' onClick={this.routeClick.bind(this, 'login')} title='Login'>Login</a>
                </li>
              }
              <li>
                <a href='#' onClick={this.routeClick.bind(this, 'help')} title='Help'>Help</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
