const {Link} = require('react-router');
const Base = require('./Base');
const React = require('react');
const store = require('../store');
const utils = require('../libs/utils');
const {isLoggedIn} = require('../libs/auth-helper');

const {makeSlug} = utils;

class Home extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = store.getState();
  }

  updateState() {
    const users = store.getState().get('users');
    this.setState({users});
  }

  componentWillMount() {
    this.unsubscribe = store.subscribe(this.onChange);

    this.updateState();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange() {
    this.updateState();
  }

  renderUser(user) {
    const _id = user.get('_id');
    const userName = user.get('name');
    const link = `/plants/${makeSlug(userName)}/${_id}`;
    return (
      <div key={_id} style={{display: 'flex', alignItems: 'center'}}>
        <Link
          style={{margin: '20px'}}
          to={link}
        >
          <span>{userName}</span>
        </Link>
      </div>
    );
  }

  anonHome(existing) {
    const elevatorPitch =
`Plaaant will improve the growth and health of 
your trees and plants by providing a way to record, 
measure, compare, and share successes and failures.`;

    return (<div id='hero'>
      <div className='home-header'>{elevatorPitch}</div>
      {!isLoggedIn() &&
        <div className='home-subheader'>
          <div><Link to={'/login'}>{'Login'}</Link>{' to get started'}</div>
        </div>
      }
      {existing &&
        <div style={{cursor: 'pointer'}} className='home-subheader'>
          <a onClick={() => this.setState({showUsers: true})}>
            {'Explore...'}
          </a>
        </div>
      }
    </div>);
  }

  renderUsers() {
    const users = store.getState().get('users');
    const {showUsers = false} = this.state || {};
    if(users && users.size && showUsers) {
      return users.valueSeq().toArray().map(user => this.renderUser(user));
    } else {
      return this.anonHome(users && users.size);
    }
  }

  render() {
    return (
      <Base>
        <div>
          {this.renderUsers()}
        </div>
      </Base>
    );
  }
}

module.exports = Home;
