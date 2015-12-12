import _ from 'lodash';
import {Link} from 'react-router';
import AddPlantNote from './AddPlantNote';
import Base from '../Base';
import LoginStore from '../../stores/LoginStore';
import LogLifecycle from 'react-log-lifecycle';
import PlantActions from '../../actions/PlantActions';
import PlantStore from '../../stores/PlantStore';
import React from 'react';

// export default AuthFeatures(class Plant extends React.Component {
export default class Plant extends LogLifecycle {

  constructor(props, conText) {
    super(props, conText);
    this.context = conText;
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

  render() {
    console.log('Plant props:', this.props);
    let {
      user,
      plants
    } = this.state || {};

    user = user || {};
    plants = plants || [];
    const plantId = _.get(this, 'props.params.id');

    const plant = _.find(plants, (p) => {
      return p._id === plantId;
    });

    // TODO: A combination of isAuthenticated and plantOwner
    const canEdit = true;

    return (
      <Base>
        {!plant &&
          <div>{`Plant not found. Looked for plant id ${plantId}`}</div>
        }
        {plant &&
          <div className='plant'>
            {plant.title &&
              <h2>{plant.title}</h2>
            }
            {plant.description &&
              <p>{plant.description}</p>
            }
            {plant.commonName &&
              <p>Common Name: {plant.commonName}</p>
            }
            {plant.botanicalName &&
              <p>Botanical Name: {plant.botanicalName}</p>
            }
            {plant.purchasedDate &&
              <p>Bought On: {plant.purchasedDate}</p>
            }
            {canEdit && <AddPlantNote />}
          </div>
        }
      </Base>
    );
  }
}
