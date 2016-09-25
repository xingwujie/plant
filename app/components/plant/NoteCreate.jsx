// Used to add a note to a plant

const cloneDeep = require('lodash/cloneDeep');
import * as actions from '../../actions';
import moment from 'moment';
import React from 'react';
import validators from '../../models';
import NoteCreateUpdate from './NoteCreateUpdate';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import AddIcon from 'material-ui/svg-icons/content/add';
import * as utils from '../../libs/utils';

const validate = validators.note;

export default class NoteCreate extends React.Component {

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.saveFiles = this.saveFiles.bind(this);
    this.createNote = this.createNote.bind(this);
  }

  createNote() {
    const {plant} = this.props;
    const note = {
      _id: utils.makeMongoId(),
      date: moment().format('MM/DD/YYYY'),
      isNew: true,
      note: '',
      plantIds: [],
      errors: {},
    };

    this.props.dispatch(actions.editNoteOpen({note, plant}));
  }

  saveNote(files) {
    const plantNote = cloneDeep(this.props.note);

    if(plantNote.plantIds.indexOf(this.props.plant._id) === -1) {
      plantNote.plantIds.push(this.props.plant._id);
    }

    // userId here is just for the validator.
    // Not hackable because replaced on server by logged in user.
    plantNote.userId = this.props.user._id;
    plantNote._id = utils.makeMongoId();

    validate(plantNote, (errors, note) => {

      if(errors) {
        console.log('create: Note validation errors:', errors);
        this.props.dispatch(actions.editNoteChange({errors}));
      } else {
        this.props.dispatch(actions.upsertNoteRequest({note, files}));
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
            save={this.save}
            saveFiles={this.saveFiles}
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
  createNote: React.PropTypes.bool,
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  plant: React.PropTypes.object.isRequired,
  postSaveSuccess: React.PropTypes.func,
  user: React.PropTypes.object.isRequired,
  note: React.PropTypes.object,
};
