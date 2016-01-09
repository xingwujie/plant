// Used to show a list of plants for a user.
// Url: /plants/<optional-user-id>

import {Link} from 'react-router';
import Base from '../Base';
// import PlantActions from '../../actions/PlantActions';
import PlantItem from './PlantItem';
// import PlantStore from '../../stores/PlantStore';
import React from 'react';
import store from '../../store';

export default class Plants extends React.Component {

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    const state = store.getState();
    this.setState(state);
    // this.setState(PlantStore.getState());
    this.unsubscribe = store.subscribe(this.onChange);

    // if(user._id) {
    //   // PlantActions.load(user._id);
    // }
  }

  componentWillUnmount() {
    this.unsubscribe(this.onChange);
  }

  onChange() {
    const state = store.getState();
    this.setState(state);
  }

  renderPlants(plants) {
    if(!plants || plants.length === 0) {
      return null;
    }

    // TODO: Temporary plant image to remove
    // const tempImg = 'http://www.maerskline.com/~/media/maersk-line/Countries/int/Images/Customer%20Cases/fruit_2_u_case.jpg';

    return plants.map((plant) => {
      return (<PlantItem
        name={plant.title}
        imageUrl={plant.imageUrl}
        id={plant._id}
        key={plant._id}
        />);
    });
  }

  render() {
    var {
      user,
      plants
    } = this.state || {};

    user = user || {};
    plants = plants || [];

    return (
      <Base>
        <h2 style={{textAlign: 'center'}}>{user.name} Plant List ({plants.length})</h2>
        <div className='plant-item-list'>
          {this.renderPlants(plants)}
          {plants.length === 0 &&
            <div className='addFirstClassBtn'>
              <Link className='btn btn-primary' to='/add-plant'>Add your first plant</Link>
            </div>
          }
        </div>
      </Base>
    );
  }
}
