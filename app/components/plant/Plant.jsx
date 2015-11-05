// import _ from 'lodash';
// import AuthRequired from '../auth/AuthRequired';
import Base from '../Base';
// import PlantActions from '../../actions/PlantActions';
import React from 'react';
import AddPlantNote from './AddPlantNote';

// export default AuthFeatures(class Plant extends React.Component {
export default class Plant extends React.Component {

  constructor(props, conText) {
    super(props, conText);
    this.context = conText;
  }

  componentDidMount() {
    this.state = {};
  }

  render() {
    var {
      title,
      cultivar,
      description,
      purchasedDate
      // plantedDate,
      // price
    } = this.props || {};

    const isAuthenticated = true;

    return (
      <Base>
        <h2>{title}</h2>
        {description &&
          <p>{description}</p>
        }
        {cultivar &&
          <p>Cultivar: {cultivar}</p>
        }
        {purchasedDate &&
          <p>Bought On: {purchasedDate}</p>
        }
        {isAuthenticated && <AddPlantNote />}
      </Base>
    );
  }
}
