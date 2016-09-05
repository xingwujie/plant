// Used to add a note to a plant

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
  }

  componentWillMount() {
    this.initState();
  }

  initState() {
    this.setState({
      plantNote: {
        date: moment().format('MM/DD/YYYY'),
        note: '',
        plantIds: [],
        errors: {}
      },
      createNote: false
    });
  }

  cancel() {
    this.initState();
  }

  saveNote(files) {
    const {plantNote} = this.state;

    if(plantNote.plantIds.indexOf(this.props.plant._id) === -1) {
      plantNote.plantIds.push(this.props.plant._id);
    }

    // userId here is just for the validator.
    // Not hackable because replaced on server by logged in user.
    plantNote.userId = this.props.user._id;
    plantNote._id = utils.makeMongoId();

    validate(plantNote, {isNew: true}, (errors, note) => {

      if(errors) {
        console.error('create: Note validation errors:', errors);
        plantNote.errors = errors;
        this.setState({plantNote});
      } else {
        this.initState();
        this.props.dispatch(actions.createNoteRequest({note, files}));
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
    const {plantNote} = this.state;
    plantNote[e.target.name] = e.target.value;
    this.setState({plantNote});
  }

  render() {
    const {
      isOwner
    } = this.props || {};

    if(!isOwner) {
      return null;
    }

    const {
      plantNote,
      createNote = false
    } = this.state || {};

    return (
      <div>
        {createNote &&
          <NoteCreateUpdate
            cancel={this.cancel}
            onChange={this.onChange}
            plantNote={plantNote}
            save={this.save}
            saveFiles={this.saveFiles}
          />
        }
        {!createNote &&
          <div style={{textAlign: 'right'}}>
            <Divider />
            <RaisedButton
              label='Create Note'
              onClick={() => this.setState({createNote: true})}
            />
          </div>
        }
      </div>
    );
  }
}

NoteCreate.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  plant: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};
