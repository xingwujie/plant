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
    const {images: existingImages = []} = this.state || {};
    const images = existingImages.concat(files);
    this.setState({images});
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

    return (
      <Paper style={paperStyle} zDepth={1}>

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
          clickAddPhoto={() => {}}
          clickSave={this.props.save}
          clickCancel={this.props.cancel}
          showButtons={true}
        />

        <Dropzone onDrop={this.onDrop}>
          <div>Drop images here or tap to select images to upload.</div>
        </Dropzone>

        {images.length &&
          images.map(image => {
            return (
              <img width={'150px'} key={image.preview} src={image.preview} />
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
  images: React.PropTypes.array,
};
