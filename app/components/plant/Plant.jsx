// Responsible for showing a single Plant for CRUD operations (this.mode)
// i.e. Create (C), Read (R), Update (U), or Delete (D)
// Url: /plant/slug/<plant-id>
// Unless Create then Url: /plant

import {isOwner} from '../../libs/auth-helper';
import {makeMongoId} from '../../libs/utils';
import * as actions from '../../actions';
import Base from '../Base';
import CircularProgress from 'material-ui/CircularProgress';
import PlantCreateUpdate from './PlantCreateUpdate';
import PlantRead from './PlantRead';
import NoteCreate from './NoteCreate';
import React from 'react';
import store from '../../store';


// const lifecycleLogOptions = {
//   names: ['props', 'nextProps', 'nextState', 'prevProps', 'prevState']
// };
// import ReactLogLifecycle from 'react-log-lifecycle';
// export default class Plant extends ReactLogLifecycle {

export default class Plant extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
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
      plants = {},
      interim = {}
    } = store.getState().toJS();
    const {id: _id} = props.params || {};
    let plant;
    if(_id) {
      plant = plants[_id];
      if(!plant && first) {
        store.dispatch(actions.loadPlantRequest({_id}));
      }
    } else {
      plant = {
        _id: makeMongoId(),
        userId: user._id,
        mode: 'create'
      };
    }
    const owner = plant && isOwner(plant, user);

    if(!owner && plant && plant.mode !== 'read') {
      store.dispatch(actions.setPlantMode({
        _id: plant._id,
        mode: 'read'
      }));
    }

    this.setState({
      isOwner: owner,
      interim,
      plant,
      user
    });

  }

  componentWillMount() {
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
      interim,
      plant
    } = this.state || {};

    if(!plant) {
      return (
        <Base>
          <CircularProgress />
        </Base>
      );
    }

    const {user, notes} = store.getState().toJS();
    const mode = plant.mode || this.state.mode || 'read';

    const interimNote = interim && interim.note && interim.note.note;

    return (
      <Base>
        <div>
          {mode === 'read' &&
            <div>
              <PlantRead
                dispatch={store.dispatch}
                interim={interim}
                isOwner={owner}
                plant={plant}
                user={user}
                notes={notes}
              />
              {plant && plant.title &&
                <NoteCreate
                  dispatch={store.dispatch}
                  isOwner={owner}
                  plant={plant}
                  user={user}
                  interimNote={interimNote}
                />
              }
            </div>
          }
          {(mode === 'edit' || mode === 'create') &&
            <PlantCreateUpdate
              dispatch={store.dispatch}
              mode={mode}
              plant={plant}
              user={user}
            />
          }
        </div>
      </Base>
    );
  }
}
