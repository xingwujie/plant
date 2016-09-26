const isEmpty = require('lodash/isEmpty');
import {Link} from 'react-router';
import Base from './Base';
import React from 'react';
import store from '../store';
import {isLoggedIn} from '../libs/auth-helper';
import * as actions from '../actions';
import * as utils from '../libs/utils';

const {makeSlug} = utils;

export default class Home extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = store.getState();

    const {
      plants = {},
      user = {},
      users = {},
    } = this.state || {};
    if(isEmpty(plants) && isLoggedIn()) {
      store.dispatch(actions.loadPlantsRequest(user._id));
    }
    if(isEmpty(users)) {
      store.dispatch(actions.loadUsersRequest());
    }
  }

  updateState() {
    const {
      user = {},
      plants = {},
      users = {}
    } = store.getState();
    const userPlants = Object.keys(plants).reduce((acc, plantId) => {
      const plant = plants[plantId];
      if(plant.userId === user._id) {
        acc[plantId] = plant;
      }
      return acc;
    }, {});
    this.setState({user, users, userPlants});
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
    console.log('renderUser', user);
    const {_id, name: userName} = user;
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

  anonHome() {
    return (<div id='hero'>
      <div className='home-header'>Trees and Plants</div>
      <div className='home-subheader'>Increase your success through tracking</div>
      <div className='home-subheader'>
        <div><Link to={'/login'}>{'Login'}</Link>{' to get started'}</div>
      </div>
    </div>);
  }

  renderUsers() {
    const {
      users = {},
    } = this.state;
    const userIds = Object.keys(users);
    if(userIds.length) {
      return userIds.map(userId => this.renderUser(users[userId]));
    } else {
      return this.anonHome();
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
