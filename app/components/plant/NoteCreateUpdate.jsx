// Used to add a note to a plant

import _ from 'lodash';
import moment from 'moment';
import Paper from 'material-ui/Paper';
import React from 'react';
import TextField from 'material-ui/TextField';
import CancelSaveButtons from './CancelSaveButtons';
import Dropzone from 'react-dropzone';

export default class NoteCreateUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
  }

  componentWillMount() {
    this.initState();
  }

  initState() {
    const {images = []} = this.props;
    this.setState({images});
  }

  onDrop(files) {
    console.log('Received files: ', files);
    this.props.saveFiles(files);
  }

  onOpenClick() {
    this.refs.dropzone.open();
  }

  render() {
    const {
      plantNote = {},
    } = this.props || {};

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

    const paperStyle = {
      padding: 20,
      width: '100%',
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
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
          onChange={this.props.onChange}
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
          onChange={this.props.onChange}
          style={textAreaStyle}
          value={note}
        />

        {!_.isEmpty(errors) &&
          <div>
            <p className='text-danger col-xs-12'>{'There were errors. Please check your input.'}</p>
          </div>
        }

        <CancelSaveButtons
          clickAddPhoto={this.onOpenClick.bind(this)}
          clickSave={this.props.save}
          clickCancel={this.props.cancel}
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
  // addPhoto: React.PropTypes.func,
  cancel: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  plantNote:  React.PropTypes.shape({
    date: React.PropTypes.string.isRequired,
    errors: React.PropTypes.object,
    note: React.PropTypes.string.isRequired,
  }),
  save: React.PropTypes.func.isRequired,
  saveFiles: React.PropTypes.func.isRequired,
  images: React.PropTypes.array,
};
