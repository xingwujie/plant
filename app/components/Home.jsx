import _ from 'lodash';
import {Link} from 'react-router';
import Base from './Base';
import Footer from './Footer';
import React from 'react';
import store from '../store';
import {isLoggedIn} from '../libs/auth-helper';

export default class Home extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object
  }

  constructor() {
    super();
    this.state = store.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    this.unsubscribe = store.subscribe(this.onChange);

    const state = store.getState();
    const {user} = state;
    const plants = user.plants.map((plant) => {
      return state.plants[plant];
    });
    this.setState({user, plants});
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange(){
    const state = store.getState();
    const {user} = state;
    const plants = user.plants.map((plant) => {
      return state.plants[plant];
    });
    this.setState({user, plants});
  }


  userPlants() {

    if(!isLoggedIn()) {
      console.log('user not logged in:', this.state.user);
      return null;
    }

    const plants = _.get(this, 'state.plants', []);

    if(!plants || plants.length === 0) {

      return (
        <div id='hero'>
          <div className='home-header'>
            {`Ready to add your first Plant or Tree?`}
          </div>
          <div className='home-subheader'>
            <a href='/plant'>{`Let's Do It`}</a>
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
            <Link to={`/plants`}>Go to plant collection...</Link>
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
          {this.userPlants()}
          {!isLoggedIn() && this.anonHome()}
        </div>
        <Footer />
      </Base>
    );
  }
}
