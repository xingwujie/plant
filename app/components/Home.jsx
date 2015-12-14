import _ from 'lodash';
import {Link} from 'react-router';
import Base from './Base';
import Footer from './Footer';
import LoginStore from '../stores/LoginStore';
import PlantStore from '../stores/PlantStore';
import React from 'react';

export default class Home extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object
  }

  constructor() {
    super();
    this.state = {
      user: LoginStore.getState(),
      plants: PlantStore.getState()
    };
    this.onLoginChange = this.onLoginChange.bind(this);
    this.onPlantChange = this.onPlantChange.bind(this);
  }

  componentWillMount() {
    LoginStore.listen(this.onLoginChange);
    PlantStore.listen(this.onPlantChange);

    const {user} = LoginStore.getState();
    const {plants} = PlantStore.getState();
    this.setState({user, plants});
  }

  componentWillUnmount() {
    LoginStore.unlisten(this.onLoginChange);
    PlantStore.unlisten(this.onPlantChange);
  }

  onLoginChange(user){
    this.setState({user});
  }

  onPlantChange(plants){
    this.setState({plants});
  }

  userPlants() {
    if(!LoginStore.isLoggedIn()) {
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

    const isLoggedIn = LoginStore.isLoggedIn();

    return (
      <Base>
        <div className='home-content'>
          {this.userPlants()}
          {!isLoggedIn && this.anonHome()}
        </div>
        <Footer />
      </Base>
    );
  }
}
