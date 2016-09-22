// Used to add a note to a plant

const _ = require('lodash');
import * as actions from '../../actions';
import moment from 'moment';
import React from 'react';
import validators from '../../models';
import NoteCreateUpdate from './NoteCreateUpdate';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import * as utils from '../../libs/utils';

const validate = validators.note;

export default class NoteCreate extends React.Component {

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.saveFiles = this.saveFiles.bind(this);
    this.createNote = this.createNote.bind(this);
  }

  createNote() {
    const note = {
      _id: utils.makeMongoId(),
      date: moment().format('MM/DD/YYYY'),
      note: '',
      plantIds: [],
      errors: {},
    };

    this.props.dispatch(actions.editNoteOpen(note));
  }

  cancel() {
    this.props.dispatch(actions.editNoteClose());
  }

  saveNote(files) {
    const plantNote = _.cloneDeep(this.props.note);

    if(plantNote.plantIds.indexOf(this.props.plant._id) === -1) {
      plantNote.plantIds.push(this.props.plant._id);
    }

    // userId here is just for the validator.
    // Not hackable because replaced on server by logged in user.
    plantNote.userId = this.props.user._id;
    plantNote._id = utils.makeMongoId();

    validate(plantNote, {isNew: true}, (errors, note) => {

      if(errors) {
        console.log('create: Note validation errors:', errors);
        this.props.dispatch(actions.editNoteChange({errors}));
      } else {
        this.props.dispatch(actions.createNoteRequest({note, files}));
        if(this.props.postSaveSuccess) {
          this.props.postSaveSuccess();
        }
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

    const createNote = !!note;

    return (
      <div>
        {createNote &&
          <NoteCreateUpdate
            cancel={this.cancel}
            onChange={this.onChange}
            plantNote={note}
            save={this.save}
            saveFiles={this.saveFiles}
          />
        }
        {!createNote &&
          <div style={{textAlign: 'right'}}>
            <Divider />
            <RaisedButton
              label='Create Note'
              onClick={this.createNote}
            />
          </div>
        }
      </div>
    );
  }
}

NoteCreate.propTypes = {
  cancel: React.PropTypes.func,
  createNote: React.PropTypes.bool,
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  plant: React.PropTypes.object.isRequired,
  postSaveSuccess: React.PropTypes.func,
  user: React.PropTypes.object.isRequired,
  note: React.PropTypes.object,
};
