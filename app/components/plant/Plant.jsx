// Responsible for showing a single Plant for CRUD operations (this.mode)
// i.e. Create (C), Read (R), Update (U), or Delete (D)
// Url: /plant/slug/<plantId>
// Unless Create then Url: /plant

import _ from 'lodash';
import Base from '../Base';
import LoginStore from '../../stores/LoginStore';
import LogLifecycle from 'react-log-lifecycle';
import PlantActions from '../../actions/PlantActions';
import PlantCreateUpdate from './PlantCreateUpdate';
import PlantRead from './PlantRead';
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
    this.setMode = this.setMode.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentWillMount() {
    const plantId = _.get(this, 'props.params.id');
    const plant = PlantStore.getPlant(plantId) || {};
    // isOwner is true if no plantId (creating) and user is logging in
    const isOwner = plantId
      ? LoginStore.isOwner(plant)
      : LoginStore.isLoggedIn;
    this.setState({
      plantId: plantId,
      isOwner: isOwner,
      plant: plant,
      mode: plantId ? 'read' : 'create'
    });

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
    const plant = PlantStore.getPlant(this.props.params.id);
    this.setState({plant});
  }

  setMode(mode) {
    this.setState({mode});
  }

  delete() {
    PlantActions.delete(this.state.plantId);
    // TODO: Transfer to /plants
  }

  render() {
    console.log('Plant.render', this.state);
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
            setMode={this.setMode}
            delete={this.delete}
            />
        }
        {(mode === 'edit' || mode === 'create') &&
          <PlantCreateUpdate
            plant={plant}
            mode={mode}
            setMode={this.setMode}
            />
        }
      </Base>
    );
  }
}
