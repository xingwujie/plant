// Responsible for showing a button or create note form

import NoteCreateUpdate from './NoteCreateUpdate';
import React from 'react';
import * as actions from '../../actions';

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
            dispatch={this.props.dispatch}
            plant={this.props.plant}
          />
        }
        {!plant.createNote &&
          <div style={{textAlign: 'left'}}>
            <button
              type='button'
              className='btn btn-primary btn-lg'
              onClick={this.createNoteClick.bind(this)}>Create Note</button>
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
};
