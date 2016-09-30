// Used to add a note to a plant

import * as actions from '../../actions';
import React from 'react';
import NoteCreateUpdate from './NoteCreateUpdate';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import * as utils from '../../libs/utils';

export default class NoteCreate extends React.Component {

  constructor(props) {
    super(props);

    this.createNote = this.createNote.bind(this);
  }

  createNote() {
    const {plant} = this.props;
    const note = {
      _id: utils.makeMongoId(),
      date: utils.dateToInt(new Date()),
      isNew: true,
      note: '',
      plantIds: [],
      errors: {},
    };

    this.props.dispatch(actions.editNoteOpen({note, plant}));
  }

  render() {
    const {
      isOwner,
      note
    } = this.props || {};

    if(!isOwner) {
      return null;
    }

    const createNote = !!note && note.isNew;

    return (
      <div>
        {createNote &&
          <NoteCreateUpdate
            dispatch={this.props.dispatch}
            plantNote={note}
            plant={this.props.plant}
          />
        }
        {!createNote &&
          <div style={{textAlign: 'right'}}>
            <FloatingActionButton
              onClick={this.createNote}
              secondary={true}
              title='Create Note'
            >
              <AddIcon />
            </FloatingActionButton>
          </div>
        }
      </div>
    );
  }
}

NoteCreate.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  note: React.PropTypes.object,
  plant: React.PropTypes.object.isRequired,
  postSaveSuccess: React.PropTypes.func,
  user: React.PropTypes.object.isRequired,
};
