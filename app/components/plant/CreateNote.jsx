// Responsible for showing a button or create note form

import * as actions from '../../actions';
import Divider from 'material-ui/Divider';
import NoteCreateUpdate from './NoteCreateUpdate';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

export default class CreateNote extends React.Component {

  createNoteClick() {
    console.log('createNoteClick');
    this.props.dispatch(actions.createNote({
      _id: this.props.plant._id,
      enable: true
    }));
  }

  render() {
    const {
      isOwner,
      plant
    } = this.props || {};

    if(!isOwner) {
      return null;
    }

    return (
      <div>
        {plant.createNote &&
          <NoteCreateUpdate
            {...this.props}
          />
        }
        {!plant.createNote &&
          <div style={{textAlign: 'right'}}>
            <Divider />
            <RaisedButton
              label='Create Note'
              onClick={this.createNoteClick.bind(this)}
            />
          </div>
        }
      </div>
    );
  }

}

CreateNote.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  plant: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};
