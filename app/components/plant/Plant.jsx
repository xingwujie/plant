// Responsible for showing a single Plant for CRUD operations (this.mode)
// i.e. Create (C), Read (R), Update (U), or Delete (D)
// Url: /plant/slug/<plant-id>
// Unless Create then Url: /plant

const {isOwner} = require('../../libs/auth-helper');
const {makeMongoId} = require('../../libs/utils');
const actions = require('../../actions');
const Base = require('../Base');
const CircularProgress = require('material-ui/CircularProgress').default;
const PlantCreateUpdate = require('./PlantCreateUpdate');
const PlantRead = require('./PlantRead');
const NoteCreate = require('./NoteCreate');
const React = require('react');
const store = require('../../store');
const Immutable = require('immutable');

class Plant extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  initState(first, props = this.props || {}) {
    const plants = store.getState().get('plants');

    const {id: _id} = props.params || {};
    let plant;
    if(_id) {
      plant = plants.get(_id);
      if(!plant && first) {
        store.dispatch(actions.loadPlantRequest({_id}));
      }
    } else {
      store.dispatch(actions.editPlantOpen({
        plant: {
          _id: makeMongoId(),
          isNew: true
        }
      }));
    }
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
- can call this.setState() here (will not trigger additional render)
*/
  componentWillReceiveProps(nextProps) {
    this.initState(true, nextProps);
  }

  onChange() {
    this.forceUpdate();
    // this.initState(false);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  fromStore(key) {
    if(store.getState().has(key)) {
      return store.getState().get(key).toJS();
    } else {
      return null;
    }
  }

  render() {
    const user = store.getState().get('user');

    const plants = store.getState().get('plants');

    const {params} = this.props;

    const plant = plants.get(params && params.id, Immutable.Map());

    const owner = isOwner(plant.toJS());

    const interim = store.getState().get('interim');
    const interimNote = interim.getIn(['note', 'note'], Immutable.Map());
    const interimPlant = interim.getIn(['plant', 'plant']);

    if(!plant && !interimPlant) {
      return (
        <Base>
          <CircularProgress />
        </Base>
      );
    }

    const notes = store.getState().get('notes');

    return (
      <Base>
        <div>
          {interimPlant
            ? <PlantCreateUpdate
              dispatch={store.dispatch}
              interimPlant={interimPlant}
              user={user}
            />
            : <div>
              <PlantRead
                dispatch={store.dispatch}
                interim={interim}
                isOwner={owner}
                plant={plant}
                plants={plants}
                user={user}
                notes={notes}
              />
              {plant && plant.get('title') &&
                <NoteCreate
                  dispatch={store.dispatch}
                  isOwner={owner}
                  plant={plant}
                  plants={plants}
                  user={user}
                  interimNote={interimNote}
                />
              }
            </div>
          }
        </div>
      </Base>
    );
  }
}

Plant.propTypes = {
  params: React.PropTypes.shape({
    id: React.PropTypes.string
  })
};

module.exports = Plant;
