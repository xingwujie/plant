// Responsible for showing a single Plant for CRUD operations (this.mode)
// i.e. Create (C), Read (R), Update (U), or Delete (D)
// Url: /plant/slug/<plant-id>
// Unless Create then Url: /plant

import _ from 'lodash';
import Base from '../Base';
import LoginStore from '../../stores/LoginStore';
import PlantActions from '../../actions/PlantActions';
import PlantCreateUpdate from './PlantCreateUpdate';
import PlantRead from './PlantRead';
import PlantStore from '../../stores/PlantStore';
import React from 'react';

export default class Plant extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.setMode = this.setMode.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentWillMount() {
    const _id = _.get(this, 'props.params.id');
    const plant = PlantStore.getPlant(_id) || {};
    // isOwner is true if no _id (creating) and user is logging in
    const isOwner = _id
      ? LoginStore.isOwner(plant)
      : LoginStore.isLoggedIn;
    this.setState({
      _id: _id,
      isOwner: isOwner,
      plant: plant,
      mode: _id ? 'read' : 'create'
    });

    if(!plant || plant.summary) {
      PlantStore.listen(this.onChange);
      PlantActions.loadOne(_id);
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
    PlantActions.delete(this.state._id);
    // Transition to /plants
    this.context.history.pushState(null, '/plants');
  }

  render() {
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
