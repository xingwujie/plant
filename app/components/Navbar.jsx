import _ from 'lodash';
import React from 'react';
import store from '../store';
import actions from '../actions';

import {Link} from 'react-router';

export default class Navbar extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    this.unsubscribe = store.subscribe(this.onChange);
    let user = store.getState().user;
    this.setState({user});
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange(){
    let user = store.getState().user;
    this.setState(user);
  }

  logout() {
    store.dispatch(actions.logout());
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
            <Link to={'/'} className='navbar-brand'>Plant</Link>
          </div>

          <div className='collapse navbar-collapse' id='plant-navbar-collapse'>
            <ul className='nav navbar-nav navbar-right'>
              {displayName &&
                <li className='dropdown'>
                  <a href='#' className='dropdown-toggle'
                    data-toggle='dropdown' role='button'
                    aria-haspopup='true' aria-expanded='false'
                    title='My Yard'>My Yard <span className='caret'></span>
                  </a>
                  <ul className='dropdown-menu'>
                    <li>
                      <Link to={'/plants'} title='My Plants'>My Plants</Link>
                    </li>
                    <li>
                      <Link to={'/plant'} title='add plant'>Add Plant</Link>
                    </li>
                  </ul>
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
                      <Link to={'/profile'}>Profile</Link>
                    </li>
                    <li>
                      <a href='#' onClick={this.logout} title='Logout'>Logout</a>
                    </li>
                  </ul>
                </li>
              }
              {!displayName &&
                <li>
                  <Link to='/login'>Login</Link>
                </li>
              }
              <li>
                <Link to={'/help'} title='help'>Help</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
