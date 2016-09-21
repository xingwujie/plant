// Used to show a list of plants for a user.
// Url: /plants/<optional-user-id>

const _ = require('lodash');
import {Link} from 'react-router';
import Base from '../Base';
import CircularProgress from 'material-ui/CircularProgress';
import InputCombo from '../InputCombo';
import PlantItem from './PlantItem';
import React from 'react';
import store from '../../store';
import {isLoggedIn} from '../../libs/auth-helper';
import * as actions from '../../actions';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import NoteCreate from '../plant/NoteCreate';

export default class Plants extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.cancelCreateNote = this.cancelCreateNote.bind(this);
    this.createNote = this.createNote.bind(this);
    this.postSaveSuccessCreateNote = this.postSaveSuccessCreateNote.bind(this);
    this.state = {...store.getState()};
    this.state.filter = '';

    const {
      // plants = {},
      // user = {},
      users = {},
    } = this.state || {};

    // if(_.isEmpty(plants) && isLoggedIn()) {
    //   store.dispatch(actions.loadPlantsRequest(user._id));
    // }

    console.log('props:', props);
    if(props.params && props.params.id) {
      // This is the user id for this page.
      const {id: userId} = props.params;
      if(!users[userId]) {
        store.dispatch(actions.loadUserRequest(userId));
        store.dispatch(actions.loadPlantsRequest(userId));
      }
    }
  }

  componentWillMount() {
    const state = {...store.getState()};
    this.setState(state);
    this.unsubscribe = store.subscribe(this.onChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange() {
    const state = {...store.getState()};
    this.setState(state);
  }

  createNote(plant) {
    this.setState({
      plantCreateNote: plant
    });
  }

  postSaveSuccessCreateNote() {
    this.setState({
      plantCreateNote: null
    });
  }

  cancelCreateNote() {
    this.setState({
      plantCreateNote: null
    });
  }

  renderTitle(user) {
    return (
      <h2 style={{textAlign: 'center'}}>{`${user.name} Plant List`}</h2>
    );
  }

  addPlantButton() {
    const loggedIn = !!isLoggedIn();
    if(!loggedIn) {
      return null;
    }

    return (
      <div style={{float: 'right', marginBottom: '60px'}}>
        <Link to='/plant'>
          <FloatingActionButton
            title='Add Plant'
          >
            <AddIcon />
          </FloatingActionButton>
        </Link>
      </div>);
  }

  renderNoPlants(user) {
    return (
      <Base>
        <div>
          {this.renderTitle(user)}
          <div className='plant-item-list'>
            <div>{'No plants added yet...'}</div>
            {this.addPlantButton()}
          </div>
        </div>
      </Base>
    );
  }

  render() {
    var {
      filter = '',
      plants: allLoadedPlants = {},
      plantCreateNote,
      user: loggedInUser = {},
      users = {},
    } = this.state || {};

    const loggedIn = !!isLoggedIn();

    const user = users[this.props.params.id];
    if(!user) {
      return (
        <Base>
          <div>
            <CircularProgress />
          </div>
        </Base>
      );
    }

    if(plantCreateNote && loggedIn) {
      return (
        <Base>
          <div>
            <h1 style={{textAlign: 'center'}}>{`Create a Note for ${plantCreateNote.title}`}</h1>
            <NoteCreate
              cancel={this.cancelCreateNote}
              createNote={true}
              dispatch={store.dispatch}
              isOwner={true}
              plant={plantCreateNote}
              postSaveSuccess={this.postSaveSuccessCreateNote}
              user={loggedInUser}
            />
          </div>
        </Base>
      );
    }

    const {plantIds} = user;
    if(_.isEmpty(plantIds)) {
      return this.renderNoPlants(user);
    }

    // Don't send the name into PlantItem to skip the subtitle
    // If all the plants are by the same user then don't need the
    // users name. If the plants are from a search result then send
    // in the name:
    // name={user.name}
    const tileElements = plantIds.reduce((acc, plantId) => {
      const plant = allLoadedPlants[plantId];
      if(plant && (!filter || (plant.title || '').toLowerCase().indexOf(filter) >= 0)) {
        acc.push(
          <PlantItem
            key={plant._id}
            createNote={this.createNote}
            isOwner={loggedIn && plant.userId === user._id}
            plant={plant}
          />
        );
      }
      return acc;
    }, []);

    const filterInput = (<InputCombo
      changeHandler={(e) => this.setState({filter: e.target.value.toLowerCase()})}
      label='Filter'
      placeholder={'Type a plant name to filter...'}
      value={filter}
    />);

    return (
      <Base>
        <div>
          {this.renderTitle(user)}
          {filterInput}
          {tileElements}
          {this.addPlantButton()}
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
