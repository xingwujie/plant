import _ from 'lodash';
import {Link} from 'react-router';
import Base from '../Base';
import LoginStore from '../../stores/LoginStore';
// import LogLifecycle from 'react-log-lifecycle';
import PlantActions from '../../actions/PlantActions';
import PlantItem from './PlantItem';
import PlantStore from '../../stores/PlantStore';
import React from 'react';

export default class Plant extends React.Component {
// export default class Plant extends LogLifecycle {

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

    return plants.map((plant) => {
      return (<PlantItem
        name={plant.name}
        imageUrl={plant.imageUrl}
        id={plant.id}
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
    const style = {
      display: 'flex',
      flexDirection: 'row'
    };

    console.log('Plants.render() this.state:', this.state);

    return (
      <Base>
        <h2>{user.name}</h2>
        <div style={style}>
          {this.renderPlants(plants)}
          {plants.length === 0 &&
            <Link to='/add-plant'>Add your first plant</Link>
          }
        </div>
      </Base>
    );
  }
}
