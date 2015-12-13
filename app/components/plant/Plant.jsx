// Responsible for showing a single Plant for CRUD operations (this.mode)
// i.e. Create (C), Read (R), Update (U), or Delete (D)
// Url: /plant/slug/<plantId>
// Unless Create then Url: /plant

import _ from 'lodash';
// import {Link} from 'react-router';
// import NoteCreateUpdate from './NoteCreateUpdate';
import PlantRead from './PlantRead';
import Base from '../Base';
import LoginStore from '../../stores/LoginStore';
import LogLifecycle from 'react-log-lifecycle';
import PlantActions from '../../actions/PlantActions';
import PlantStore from '../../stores/PlantStore';
import React from 'react';

// Optional flags:
const options = {
  // If logType is set to keys then the props of the object being logged
  // will be written out instead of the whole object. Remove logType or
  // set it to anything except keys to have the full object logged.
  logType: 'keys',
  // A list of the param "types" to be logged.
  // The example below has all the types.
  names: ['props', 'nextProps', 'nextState', 'prevProps', 'prevState']
};

// export default AuthFeatures(class Plant extends React.Component {
export default class Plant extends LogLifecycle {

  constructor(props) {
    super(props, options);
    this.onChange = this.onChange.bind(this);
    this.editPlant = this.editPlant.bind(this);
  }

  componentWillMount() {
    const plantId = _.get(this, 'props.params.id');
    const plant = PlantStore.getPlant(plantId);
    this.setState({
      plantId: plantId,
      isOwner: LoginStore.isOwner(plantId),
      plant: plant,
      mode: 'read'
    });

    console.log('Plant.componentWillMount state:', this.state);

    if(!plant || plant.summary) {
      PlantStore.listen(this.onChange);
      PlantActions.loadOne(plantId);
    }
  }

  componentWillUnmount() {
    PlantStore.unlisten(this.onChange);
  }

  onChange() {
    // We get the whole plant store. We only want one plant.
    console.log('Plant.onChange props:', this.props);
    console.log('Plant.onChange this.props.params.id:', this.props.params.id);
    const plant = PlantStore.getPlant(this.props.params.id);
    console.log('Plant.onChange plant:', plant);
    this.setState({plant});
  }

  editPlant() {
    this.setState({mode: 'edit'});
  }

  render() {
    console.log('Plant.render props/state:', this.props, this.state);
    let {
      isOwner,
      plant,
      mode
    } = this.state || {};

    return (
      <Base>
        {mode === 'read' &&
          <PlantRead
            plant={plant}
            isOwner={isOwner}
            />
        }
        {mode === 'edit' &&
          <PlantRead
            plant={plant}
            isOwner={isOwner}
            />
        }
      </Base>
    );
  }
}
