// Used to show a list of plants for a user.
// Url: /plants/<optional-user-id>

const _ = require('lodash');
import {Link} from 'react-router';
import Base from '../Base';
// import PlantActions from '../../actions/PlantActions';
import PlantItem from './PlantItem';
// import PlantStore from '../../stores/PlantStore';
import React from 'react';
import store from '../../store';
import {isLoggedIn} from '../../libs/auth-helper';
import * as actions from '../../actions';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import NoteCreate from '../plant/NoteCreate';

export default class Plants extends React.Component {

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.cancelCreateNote = this.cancelCreateNote.bind(this);
    this.createNote = this.createNote.bind(this);
    this.postSaveSuccessCreateNote = this.postSaveSuccessCreateNote.bind(this);
    this.state = store.getState();

    const {
      user = {},
      plants = {}
    } = this.state || {};
    if(_.isEmpty(plants) && isLoggedIn()) {
      store.dispatch(actions.loadPlants(user._id));
    }
  }

  componentWillMount() {
    const state = store.getState();
    this.setState(state);
    this.unsubscribe = store.subscribe(this.onChange);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChange() {
    const state = store.getState();
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

  renderNoPlants(user) {
    return (
      <Base>
        <div>
          {this.renderTitle(user)}
          <div className='plant-item-list'>
              <div className='addFirstClassBtn'>
                <Link className='btn btn-primary' to='/plant'>Add your first plant</Link>
              </div>
          </div>
        </div>
      </Base>
    );
  }

  render() {
    var {
      user = {},
      plants = {},
      plantCreateNote
    } = this.state || {};

    if(plantCreateNote) {
      console.log('plantCreateNote:', plantCreateNote);
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
              user={user}
            />
          </div>
        </Base>
      );
    }

    if(_.isEmpty(plants)) {
      return this.renderNoPlants(user);
    }

    const loggedIn = isLoggedIn();

    // Don't send the name into PlantItem to skip the subtitle
    // If all the plants are by the same user then don't need the
    // users name. If the plants are from a search result then send
    // in the name:
    // name={user.name}
    const tileElements = _.map(plants, plant => <PlantItem
        key={plant._id}
        createNote={this.createNote}
        isOwner={loggedIn && plant.userId === user._id}
        plant={plant}
      />
    );

    return (
      <Base>
        <div>
          {this.renderTitle(user)}
          {tileElements}
          {loggedIn &&
            <div style={{float: 'right'}}>
              <Link to='/plant'>
                <FloatingActionButton
                  title='Add Plant'
                >
                  <AddIcon />
                </FloatingActionButton>
              </Link>
            </div>
          }
        </div>
      </Base>
    );
  }
}
