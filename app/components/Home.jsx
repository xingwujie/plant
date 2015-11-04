import _ from 'lodash';
import Base from './Base';
import Footer from './Footer';
import LoginStore from '../stores/LoginStore';
import PlantStore from '../stores/PlantStore';
import React from 'react';

export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      user: LoginStore.getState(),
      plants: PlantStore.getState()
    };
    this.onLoginChange = this.onLoginChange.bind(this);
    this.onPlantChange = this.onPlantChange.bind(this);
  }

  componentDidMount() {
    LoginStore.listen(this.onLoginChange);
    PlantStore.listen(this.onPlantChange);
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
    // Fake a list of 10 plants
    const plants = _.get(this, 'state.plants');
    return plants.map((item) => {
      return (
        <div key={item._id} className='home-plant'>
          <a href={`/plant/${item.name}`}>{item.name}</a>
        </div>
      );
    });
  }

  anonHome() {
    return (<div id='hero'>
      <div className='home-header'>Fruit Trees and Plants</div>
      <div className='home-subheader'>Increase your success through tracking</div>
      <div className='home-subheader'>
        <div>Login to get started</div>
        <a href='/auth/facebook'>
          <img src='/img/facebook-login.png' />
        </a>
        </div>
    </div>);
  }

  firstPlant() {
    return (<div id='hero'>
      <div className='home-header'>Read to add your first Plant or Tree?</div>
      <div className='home-subheader'>
        <a href='/add-plant'>
          Add My First Plant or Tree
        </a>
        </div>
    </div>);
  }

  render() {

    const displayName = _.get(this, 'state.user.name');
    const plants = _.get(this, 'state.plants');

    return (
      <Base>
        <div className='home-content'>
          {plants && plants.length && this.userPlants()}
          {displayName && (!plants || !plants.length) && this.firstPlant()}
          {!displayName && this.anonHome()}
        </div>
        <Footer />
      </Base>
    );
  }
}
