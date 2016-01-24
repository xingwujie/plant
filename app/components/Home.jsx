import {Link} from 'react-router';
import Base from './Base';
import React from 'react';
import store from '../store';
import {isLoggedIn} from '../libs/auth-helper';
import * as actions from '../actions';

export default class Home extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object
  };

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = store.getState();

    const {
      user = {},
      plants = []
    } = this.state || {};
    if(plants.length === 0 && isLoggedIn()) {
      store.dispatch(actions.loadPlants(user._id));
    }
  }

  updateState() {
    const {
      user = {},
      plants = []
    } = store.getState();
    const userPlants = plants.filter((plant) => {
      return plant.userId === user._id;
    });
    this.setState({user, userPlants});
  }

  componentWillMount() {
    this.unsubscribe = store.subscribe(this.onChange);
    // store.dispatch(actions.loadPlants());

    this.updateState();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange(){
    this.updateState();
  }


  renderUserPlants() {
    const {
      user = {},
      userPlants: plants = {}
    } = this.state;
    if(!user.isLoggedIn) {
      console.log('user not logged in:', user);
      return null;
    }

    if(!plants || plants.length === 0) {

      return (
        <div id='hero'>
          <div className='home-header'>
            {`Ready to add your first Plant or Tree?`}
          </div>
          <div className='home-subheader'>
            <Link to='/plant'>{`Let's Do It`}</Link>
          </div>
        </div>
    );

    } else {

      return (
        <div id='hero'>
          <div className='home-header'>
            {`You have ${plants.length} plant${plants.length > 1 ? 's' : ''} in your collection. `}
          </div>
          <div className='home-subheader'>
            <Link to={`/plants`}>{'Go to plant collection...'}</Link>
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
        <div>Login to get started</div>
        <a href='/auth/facebook'>
          <img src='/img/facebook-login.png' />
        </a>
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
