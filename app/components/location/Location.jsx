// Used to show a list of plants for a location.
// Url: /location/<location-name>/_location_id

const Base = require('../Base');
const CircularProgress = require('material-ui/CircularProgress').default;
const InputCombo = require('../InputCombo');
const PlantItem = require('../plants/PlantItem');
const React = require('react');
const store = require('../../store');
const {isLoggedIn} = require('../../libs/auth-helper');
const actions = require('../../actions');
const NoteCreate = require('../plant/NoteCreate');
const utils = require('../../libs/utils');
const Immutable = require('immutable');
const AddPlantButton = require('../plant/AddPlantButton');

class Location extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.postSaveSuccessCreateNote = this.postSaveSuccessCreateNote.bind(this);
    this.state = {...store.getState().toJS()};
    this.state.filter = '';

    const {
      locations = {},
    } = this.state || {};

    const {id: locationId} = props.params;
    if(!locations[locationId] || !locations[locationId].plantIds) {
      store.dispatch(actions.loadPlantsRequest(locationId));
    }
  }

  componentWillMount() {
    const state = {...store.getState().toJS()};
    this.setState(state);
    this.unsubscribe = store.subscribe(this.onChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange() {
    const state = {...store.getState().toJS()};
    this.setState(state);
  }

  postSaveSuccessCreateNote() {
    store.dispatch(actions.editNoteClose());
  }

  renderTitle(location) {
    return (
      <h2 style={{textAlign: 'center'}}>{`${location.get('title')} - Plant List`}</h2>
    );
  }

  isOwner() {
    // TODO: Check the logic below
    var {
      user: authUser = {},
      users = {},
    } = this.state || {};
    const user = users[this.props.params.id];
    return !!(user && authUser._id === user._id);
  }

  addPlantButton() {
    return (
      <div style={{float: 'right', marginBottom: '60px'}}>
        <AddPlantButton
          show={this.isOwner()}
        />
      </div>
    );
  }

  // TODO: renderWaiting and renderNoPlants are mostly the same.
  // Make this code DRY
  renderWaiting(location) {
    return (
      <Base>
        <div>
          {this.renderTitle(location)}
          <h3 style={{textAlign: 'center'}}>
            <CircularProgress />
          </h3>
        </div>
      </Base>
    );
  }

  renderNoPlants(location) {
    return (
      <Base>
        <div>
          {this.renderTitle(location)}
          <h3 style={{textAlign: 'center'}}>
            <div style={{marginTop: '100px'}}>{'No plants added yet...'}</div>
            <AddPlantButton
              show={this.isOwner()}
              style={{marginTop: '10px'}}
            />
          </h3>
        </div>
      </Base>
    );
  }

  render() {
    const {
      filter = '',
    } = this.state || {};
    const locations = store.getState().get('locations');

    const loggedIn = !!isLoggedIn();

    const location = locations.get(this.props.params.id);
    if(!location) {
      return (
        <Base>
          <div>
            <CircularProgress />
          </div>
        </Base>
      );
    }
    const allLoadedPlants = store.getState().get('plants');
    const interim = store.getState().get('interim');
    const authUser = store.getState().get('user');

    const interimNote = interim.getIn(['note', 'note']);
    const plantCreateNote = interim.getIn(['note', 'plant']);
    const createNote = !!interimNote && interimNote.get('isNew');

    if(createNote && loggedIn) {
      return (
        <Base>
          <div>
            <h4 style={{textAlign: 'center'}}>{`Create a Note for ${plantCreateNote.get('title')}`}</h4>
            <NoteCreate
              dispatch={store.dispatch}
              isOwner={true}
              interimNote={interimNote}
              plant={plantCreateNote}
              plants={allLoadedPlants}
              postSaveSuccess={this.postSaveSuccessCreateNote}
              user={authUser}
            />
          </div>
        </Base>
      );
    }

    const plantIds = location.get('plantIds', Immutable.List());
    if(!plantIds.size) {
      if(interim.has('loadPlantRequest')) {
        return this.renderWaiting(location);
      } else {
        return this.renderNoPlants(location);
      }

    }

    const sortedPlantIds = utils.filterSortPlants(plantIds, allLoadedPlants, filter);

    // Don't send the name into PlantItem to skip the subtitle
    // If all the plants are at the same location then don't need the
    // location name. If the plants are from a search result then send
    // in the name:
    // title={location.title}
    const tileElements = sortedPlantIds.reduce((acc, plantId) => {
      const plant = allLoadedPlants.get(plantId);
      if(plant) {
        const _id = plant.get('_id');
        const isOwner = loggedIn && plant.get('userId') === authUser.get('_id');
        acc.found.push(
          <PlantItem
            key={_id}
            dispatch={store.dispatch}
            createNote={this.createNote}
            isOwner={isOwner}
            plant={plant}
          />
        );
      } else {
        acc.unloaded.push(plantId);
      }
      return acc;
    }, {found: [], unloaded: []});

    if(tileElements.unloaded.length) {
      store.dispatch(actions.loadUnloadedPlantsRequest(tileElements.unloaded));
    }

    const filterInput = (<InputCombo
      changeHandler={(e) => this.setState({filter: e.target.value.toLowerCase()})}
      label='Filter'
      placeholder={'Type a plant name to filter...'}
      value={filter}
      name='filter'
    />);

    return (
      <Base>
        <div>
          {this.renderTitle(location)}
          {filterInput}
          {tileElements.found}
          {this.addPlantButton()}
          <div className='clear'>&nbsp;</div>
        </div>
      </Base>
    );
  }
}

Location.propTypes = {
  params:  React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
  }).isRequired,
};

module.exports = Location;
