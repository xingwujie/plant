// Used to update a note in a plant

const cloneDeep = require('lodash/cloneDeep');
import * as actions from '../../actions';
import React from 'react';
import validators from '../../models';
import NoteCreateUpdate from './NoteCreateUpdate';

const validate = validators.note;

export default class NoteUpdate extends React.Component {

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.saveFiles = this.saveFiles.bind(this);
  }

  saveNote(files) {
    const plantNote = cloneDeep(this.props.note);

    if(plantNote.plantIds.indexOf(this.props.plant._id) === -1) {
      plantNote.plantIds.push(this.props.plant._id);
    }

    validate(plantNote, (errors, note) => {

      if(errors) {
        console.log('update: Note validation errors:', errors);
        this.props.dispatch(actions.editNoteChange({errors}));
      } else {
        this.props.dispatch(actions.upsertNoteRequest({note, files}));
      }
    });
  }

  saveFiles(files) {
    this.saveNote(files);
  }

  save(e) {
    this.saveNote();
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const {
      isOwner,
      note
    } = this.props || {};

    if(!isOwner) {
      return null;
    }

    return (
      <NoteCreateUpdate
        dispatch={this.props.dispatch}
        plantNote={note}
        save={this.save}
        saveFiles={this.saveFiles}
      />
    );
  }
}

NoteUpdate.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  note: React.PropTypes.object.isRequired,
  plant: React.PropTypes.object.isRequired,
};
