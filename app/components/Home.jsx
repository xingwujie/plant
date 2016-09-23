const isEmpty = require('lodash/isEmpty');
import {Link} from 'react-router';
import Base from './Base';
import React from 'react';
import store from '../store';
import {isLoggedIn} from '../libs/auth-helper';
import * as actions from '../actions';
import * as utils from '../libs/utils';

export default class Home extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = store.getState();

    const {
      user = {},
      plants = {}
    } = this.state || {};
    if(isEmpty(plants) && isLoggedIn()) {
      store.dispatch(actions.loadPlantsRequest(user._id));
    }
  }

  updateState() {
    const {
      user = {},
      plants = {}
    } = store.getState();
    const userPlants = Object.keys(plants).reduce((acc, plantId) => {
      const plant = plants[plantId];
      if(plant.userId === user._id) {
        acc[plantId] = plant;
      }
      return acc;
    }, {});
    this.setState({user, userPlants});
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


  renderUserPlants() {
    const {
      user = {},
      userPlants: plants = {}
    } = this.state;
    if(!user.isLoggedIn) {
      console.warn('user not logged in:', user);
      return null;
    }

    if(isEmpty(plants)) {

      return (
        <div id='hero'>
          <div className='home-header'>
            {'Ready to add your first Plant or Tree?'}
          </div>
          <div className='home-subheader'>
            <Link to='/plant'>{'Let\'s Do It'}</Link>
          </div>
        </div>
    );

    } else {
      const numPlants = Object.keys(plants).length;
      return (
        <div id='hero'>
          <div className='home-header'>
            {`You have ${numPlants} plant${numPlants > 1 ? 's' : ''} in your collection. `}
          </div>
          <div className='home-subheader'>
            <Link to={utils.makePlantsUrl(user)}>{'Go to plant collection...'}</Link>
          </div>
        </div>
      );
    }
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

  render() {
    return (
      <Base>
        <div className='home-content'>
          {this.renderUserPlants()}
          {!isLoggedIn() && this.anonHome()}
        </div>
      </Base>
    );
  }
}
