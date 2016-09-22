// Used to update a note in a plant

const _ = require('lodash');
import * as actions from '../../actions';
import React from 'react';
import validators from '../../models';
import NoteCreateUpdate from './NoteCreateUpdate';

const validate = validators.note;

export default class NoteUpdate extends React.Component {

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.saveFiles = this.saveFiles.bind(this);
  }

  cancel() {
    this.props.dispatch(actions.editNoteClose());
  }

  saveNote(files) {
    const plantNote = _.cloneDeep(this.props.note);

    if(plantNote.plantIds.indexOf(this.props.plant._id) === -1) {
      plantNote.plantIds.push(this.props.plant._id);
    }

    validate(plantNote, {isNew: false}, (errors, note) => {

      if(errors) {
        console.log('update: Note validation errors:', errors);
        this.props.dispatch(actions.editNoteChange({errors}));
      } else {
        this.props.dispatch(actions.updateNoteRequest({note, files}));
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

  onChange(e) {
    this.props.dispatch(actions.editNoteChange({
      [e.target.name]: e.target.value
    }));
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
        cancel={this.cancel}
        onChange={this.onChange}
        plantNote={note}
        save={this.save}
        saveFiles={this.saveFiles}
      />
    );
  }
}

NoteUpdate.propTypes = {
  cancel: React.PropTypes.func.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  note: React.PropTypes.object.isRequired,
  plant: React.PropTypes.object.isRequired,
};
