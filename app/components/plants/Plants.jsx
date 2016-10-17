// Used to show a list of plants for a user.
// Url: /plants/<optional-user-id>

const Base = require('../Base');
const CircularProgress = require('material-ui/CircularProgress').default;
const InputCombo = require('../InputCombo');
const PlantItem = require('./PlantItem');
const React = require('react');
const store = require('../../store');
const {isLoggedIn} = require('../../libs/auth-helper');
const actions = require('../../actions');
const NoteCreate = require('../plant/NoteCreate');
const utils = require('../../libs/utils');
const Immutable = require('immutable');
const AddPlantButton = require('../plant/AddPlantButton');

class Plants extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.postSaveSuccessCreateNote = this.postSaveSuccessCreateNote.bind(this);
    this.state = {...store.getState().toJS()};
    this.state.filter = '';

    const {
      users = {},
    } = this.state || {};

    if(props.params && props.params.id) {
      // This is the user id for this page.
      const {id: userId} = props.params;
      if(!users[userId] || !users[userId].plantIds) {
        store.dispatch(actions.loadPlantsRequest(userId));
      }
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

  renderTitle(user) {
    return (
      <h2 style={{textAlign: 'center'}}>{`${user.get('name')} Plant List`}</h2>
    );
  }

  isOwner() {
    var {
      user: authUser = {},
      users = {},
    } = this.state || {};
    const user = users[this.props.params.id];
    return user && (authUser._id === user._id);
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
  renderWaiting(user) {
    return (
      <Base>
        <div>
          {this.renderTitle(user)}
          <h3 style={{textAlign: 'center'}}>
            <CircularProgress />
          </h3>
        </div>
      </Base>
    );
  }

  renderNoPlants(user) {
    return (
      <Base>
        <div>
          {this.renderTitle(user)}
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
    const users = store.getState().get('users');

    const loggedIn = !!isLoggedIn();

    const user = users.get(this.props.params.id);
    if(!user) {
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
              user={store.getState().get('user')}
            />
          </div>
        </Base>
      );
    }

    const plantIds = user.get('plantIds', Immutable.List());
    if(!plantIds.size) {
      if(interim.has('loadPlantRequest')) {
        return this.renderWaiting(user);
      } else {
        return this.renderNoPlants(user);
      }

    }

    const sortedPlantIds = utils.filterSortPlants(plantIds, allLoadedPlants, filter);

    // Don't send the name into PlantItem to skip the subtitle
    // If all the plants are by the same user then don't need the
    // users name. If the plants are from a search result then send
    // in the name:
    // name={user.name}
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
          {this.renderTitle(user)}
          {filterInput}
          {tileElements.found}
          {this.addPlantButton()}
          <div className='clear'>&nbsp;</div>
        </div>
      </Base>
    );
  }
}

Plants.propTypes = {
  params:  React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
  }).isRequired,
};

module.exports = Plants;
