// Responsible for showing a single Plant for CRUD operations (this.mode)
// i.e. Create (C), Read (R), Update (U), or Delete (D)
// Url: /plant/slug/<plant-id>
// Unless Create then Url: /plant

import _ from 'lodash';
import {isOwner} from '../../libs/auth-helper';
import {makeCouchId} from '../../libs/utils';
import * as actions from '../../actions';
import Base from '../Base';
import PlantCreateUpdate from './PlantCreateUpdate';
import PlantRead from './PlantRead';
import React from 'react';
import store from '../../store';


// const lifecycleLogOptions = {
//   names: ['props', 'nextProps', 'nextState', 'prevProps', 'prevState']
// };
// import ReactLogLifecycle from 'react-log-lifecycle';
// export default class Plant extends ReactLogLifecycle {

export default class Plant extends React.Component {
  static contextTypes = {
    history: React.PropTypes.object
  };

  constructor(props) {
    // super(props, lifecycleLogOptions);
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {};
  }

  initState(first, props = this.props || {}) {
    const {
      user = {},
      plants = []
    } = store.getState();
    const _id = _.get(props, 'params.id');
    let plant;
    if(_id) {
      plant = _.find(plants, p => p._id === _id);
      if(!plant && first) {
        store.dispatch(actions.loadPlant({_id}));
        plant = {};
      }
    } else {
      plant = {
        _id: makeCouchId(),
        userId: user._id,
        mode: 'create'
      };
    }
    // console.log('initState plant:', plant, _id, props);
    this.setState({
      isOwner: plant && isOwner(plant, user),
      plant
    });

  }

  componentWillMount() {
    // console.log('componentWillMount');
    this.unsubscribe = store.subscribe(this.onChange);
    this.initState(true);
  }

/*
- Start of cycle #2
- invoked when component is receiving new props
- not called in cycle #1
- this.props is old props
- parameter to this function is nextProps
- can call this.setState() here (will not trigger addition render)
*/
  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps');
    this.initState(true, nextProps);
  }

  onChange() {
    this.initState(false);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const {
      isOwner: owner = false,
      plant = {}
    } = this.state || {};

    const mode = plant.mode || this.state.mode || 'read';

    return (
      <Base>
        {mode === 'read' &&
          <PlantRead
            dispatch={store.dispatch}
            isOwner={owner}
            plant={plant}
            />
        }
        {(mode === 'edit' || mode === 'create') &&
          <PlantCreateUpdate
            dispatch={store.dispatch}
            mode={mode}
            plant={plant}
          />
        }
      </Base>
    );
  }
}
