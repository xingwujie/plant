// Responsible for showing a single Plant for CRUD operations (this.mode)
// i.e. Create (C), Read (R), Update (U), or Delete (D)
// Url: /plant/slug/<plant-id>
// Unless Create then Url: /plant

import _ from 'lodash';
import {isOwner} from '../../libs/auth-helper';
import * as actions from '../../actions';
import Base from '../Base';
import PlantCreateUpdate from './PlantCreateUpdate';
import PlantRead from './PlantRead';
import React from 'react';
import slug from 'slug';
import store from '../../store';
import {makeCouchId} from '../../libs/utils';

import ReactLogLifecycle from 'react-log-lifecycle';
export default class Plant extends ReactLogLifecycle {

  // export default class Plant extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.setMode = this.setMode.bind(this);
    this.delete = this.delete.bind(this);
    this.createPlant = this.createPlant.bind(this);
    this.updatePlant = this.updatePlant.bind(this);
  }

  componentWillMount() {
    this.unsubscribe = store.subscribe(this.onChange);
    // TODO: store to move higher to container .jsx and user should be passed in as a prop
    console.log('Plant.componentWillMount start');
    const {
      user = {},
      plants = []
    } = store.getState();
    let _id = _.get(this, 'props.params.id');
    const mode = _id ? 'read' : 'create';
    let plant;
    if(mode === 'read') {
      plant = _.find(plants, p => p._id === _id);
      if(!plant) {
        store.dispatch(actions.loadPlant({_id}));
      }
    } else {
      // create
      _id = _id || makeCouchId();
      plant = {
        _id,
        userId: user._id
      };
    }
    console.log('mode/plant:', mode, plant);
    this.setState({
      _id,
      isOwner: isOwner(plant, user),
      plant,
      mode
    });

    // if(!plant || plant.summary) {
    //   PlantStore.listen(this.onChange);
    //   // PlantActions.loadOne(_id);
    // }
    console.log('Plant.componentWillMount end');
  }

  componentWillReceiveProps(nextProps) {
    // console.log('#1 Plant componentWillReceiveProps', this.props, nextProps);
    if(nextProps.params.id && nextProps.params.slug) {
      // Can not be in create mode - only read or edit mode at this point.
      if(this.state.mode === 'create') {
        console.log('Setting mode to read');
        this.setState({mode: 'read'});
      }
    }
    // console.log('#2 Plant componentWillReceiveProps', this.state, store.getState());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange() {
    const {
      user = {},
      plants = []
    } = store.getState();
    const {mode = 'read'} = this.state;
    if(mode === 'read') {
      const _id = _.get(this, 'props.params.id');
      const plant = _.find(plants, p => p._id === _id);
      if(plant) {
        this.setState({
          _id,
          isOwner: isOwner(plant, user),
          plant,
          mode
        });
      }
    }

  }

  setMode(mode) {
    this.setState({mode});
  }

  createPlant(plant) {
    console.log('Plant: createPlant:', plant);
    store.dispatch(actions.addPlant(plant));
    this.setMode('read');
    this.context.history.pushState(null, `/plant/${slug(plant.title)}/${plant._id}`);
  }

  updatePlant(plant) {
    console.log('Plant: updatePlant:', plant);
    store.dispatch(actions.updatePlant(plant));
    this.setMode('read');
    this.context.history.pushState(null, `/plant/${slug(plant.title)}/${plant._id}`);
  }

  delete() {
    store.dispatch(actions.deletePlant(this.state._id));
    // PlantActions.delete(this.state._id);
    // Transition to /plants
    this.context.history.pushState(null, '/plants');
  }

  render() {
    const {
      owner,
      plant,
      mode
    } = this.state || {};

    return (
      <Base>
        {mode === 'read' &&
          <PlantRead
            plant={plant}
            isOwner={owner}
            setMode={this.setMode}
            delete={this.delete}
            />
        }
        {(mode === 'edit' || mode === 'create') &&
          <PlantCreateUpdate
            plant={plant}
            mode={mode}
            setMode={this.setMode}
            save={mode === 'create' ? this.createPlant : this.updatePlant}
            />
        }
      </Base>
    );
  }
}
