// Used to add a note to a plant

const cloneDeep = require('lodash/cloneDeep');
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import Paper from 'material-ui/Paper';
import React from 'react';
import TextField from 'material-ui/TextField';
import CancelSaveButtons from './CancelSaveButtons';
import Dropzone from 'react-dropzone';
import LinearProgress from 'material-ui/LinearProgress';
import CircularProgress from 'material-ui/CircularProgress';
const actions = require('../../actions');
import * as utils from '../../libs/utils';

import validators from '../../models';
const validate = validators.note;

export default class NoteCreateUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.cancel = this.cancel.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.save = this.save.bind(this);
    this.saveFiles = this.saveFiles.bind(this);

  }

  cancel() {
    this.props.dispatch(actions.editNoteClose());
  }

  componentWillMount() {
    this.initState();
  }

  initState() {
    const {images = []} = this.props;
    this.setState({images});
  }

  onChange(e) {
    this.props.dispatch(actions.editNoteChange({
      [e.target.name]: e.target.value
    }));
  }

  onDrop(files) {
    // console.log('Received files: ', files);
    this.saveFiles(files);
  }

  onOpenClick() {
    this.refs.dropzone.open();
  }

  saveNote(files) {
    const plantNote = cloneDeep(this.props.plantNote);

    if(plantNote.plantIds.indexOf(this.props.plant._id) === -1) {
      plantNote.plantIds.push(this.props.plant._id);
    }

    plantNote._id = plantNote._id || utils.makeMongoId();

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
    const paperStyle = {
      padding: 20,
      width: '100%',
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };

    const {
      plantNote = {},
    } = this.props || {};

    if(plantNote.uploadProgress) {
      const linearProgressStyle = {
        width: '100%',
        height: '20px'
      };
      const {value, max} = plantNote.uploadProgress;
      const progress = `Upload progress ${Math.round(value * 100 / max)} %`;
      return (
        <Paper
          style={paperStyle}
          zDepth={1}
        >
          {value !== max &&
            <div>
              <h1 style={{fontSize: 'xx-large'}}>{progress}</h1>
              <LinearProgress style={linearProgressStyle} mode='determinate' value={value} max={max} />
            </div>
          }
          {value === max &&
            <div style={{display: 'flex', fontSize: 'xx-large', justifyContent: 'space-between'}}>
              <h1>{'Upload complete... Finishing up... Hang on...'}</h1>
              <CircularProgress />
            </div>
          }
        </Paper>
      );
    }

    const {
      images = []
    } = this.state || {};

    const {
      date = moment.format('MM/DD/YYYY'),
      errors = {},
      note = ''
    } = plantNote;

    const textAreaStyle = {
      textAlign: 'left'
    };

    const underlineStyle = {
      display: 'none',
    };

    const textFieldStyle = {
      marginLeft: 20,
      textAlign: 'left'
    };

    const imageStyle = {
      maxWidth: '100%',
      padding: '1%'
    };

    const dropZoneStyle = {
      backgroundColor: 'beige',
      borderColor: 'khaki',
      borderStyle: 'solid',
      borderWidth: '3px',
      height: '40px',
      width: '100%',
    };

    const dropZoneActiveStyle = {
      backgroundColor: 'darkseagreen',
      borderColor: 'tan',
    };

    return (
      <Paper
        style={paperStyle}
        zDepth={1}
      >

        <TextField
          errorText={errors.date}
          floatingLabelText='Date'
          fullWidth={true}
          hintText={'MM/DD/YYYY'}
          name='date'
          onChange={this.onChange}
          style={textFieldStyle}
          underlineStyle={underlineStyle}
          value={date}
        />

        <TextField
          errorText={errors.note}
          floatingLabelText='Note'
          fullWidth={true}
          hintText='What has happened since your last note?'
          multiLine={true}
          name='note'
          onChange={this.onChange}
          style={textAreaStyle}
          value={note}
        />

        {!isEmpty(errors) &&
          <div>
            <p className='text-danger col-xs-12'>{'There were errors. Please check your input.'}</p>
          </div>
        }

        <CancelSaveButtons
          clickAddPhoto={this.onOpenClick.bind(this)}
          clickSave={this.save}
          clickCancel={this.cancel}
          showButtons={true}
        />

        <Dropzone
          activeStyle={dropZoneActiveStyle}
          onDrop={this.onDrop}
          ref='dropzone'
          style={dropZoneStyle}
        >
          <div>Drop images here or tap to select images to upload.</div>
        </Dropzone>

        {!!images.length &&
          images.map(image => {
            return (
              <div key={image.preview}>
                <img style={imageStyle} src={image.preview} />
              </div>
            );
          })
        }

      </Paper>
    );
  }
}

NoteCreateUpdate.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  images: React.PropTypes.array,
  plant: React.PropTypes.object.isRequired,
  plantNote:  React.PropTypes.shape({
    date: React.PropTypes.string.isRequired,
    errors: React.PropTypes.object,
    note: React.PropTypes.string.isRequired,
  }),
  postSaveSuccess: React.PropTypes.func,
};
