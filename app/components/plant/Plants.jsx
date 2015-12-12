import _ from 'lodash';
import {Link} from 'react-router';
import Base from '../Base';
import LoginStore from '../../stores/LoginStore';
import LogLifecycle from 'react-log-lifecycle';
import PlantActions from '../../actions/PlantActions';
import PlantItem from './PlantItem';
import PlantStore from '../../stores/PlantStore';
import React from 'react';

// export default class Plant extends React.Component {
export default class Plant extends LogLifecycle {

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    const login = LoginStore.getState() || {};
    this.setState(login);
    this.setState(PlantStore.getState());
    PlantStore.listen(this.onChange);
    const userId = _.get(login, 'user._id');
    if(userId) {
      PlantActions.load(login.user._id);
    }
  }

  componentWillUnmount() {
    PlantStore.unlisten(this.onChange);
  }

  onChange(plants) {
    this.setState(plants);
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

    console.log('Plants.render() this.state:', this.state);

    return (
      <Base>
        <h2 style={{textAlign: 'center'}}>{user.name} Plant List</h2>
        <div className='plant-list'>
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
