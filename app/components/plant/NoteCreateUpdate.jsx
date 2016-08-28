// Used to add a note to a plant

import _ from 'lodash';
import * as actions from '../../actions';
import moment from 'moment';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import TextField from 'material-ui/TextField';
import validators from '../../models';

const validate = validators.note;

export default class NoteCreateUpdate extends React.Component {

  constructor(props) {
    super(props);
    const {
      note = {}
    } = props || {};
    const {
      date = new Date()
    } = note;

    this.state = {
      userId: this.props.user._id,
      ...note,
      date: moment(date).format('MM/DD/YYYY'),
      isNew: !note._id
    };
  }

  save(e) {
    const note = this.state;
    const {isNew} = note;
    if(!_.isArray(note.plantIds)) {
      note.plantIds = [];
    }
    console.log('note.plantIds:', note.plantIds);
    console.log('this.props.plant._id:', this.props.plant._id);
    if(note.plantIds.indexOf(this.props.plant._id) === -1) {
      note.plantIds.push(this.props.plant._id);
    }

    validate(note, {isNew}, (errors, transformed) => {
      console.log('NoteCreateUpdate.save errors:', errors);
      console.log('NoteCreateUpdate.save transformed:', transformed);
      if(errors) {
        console.log('Note validation errors:', errors);
        this.setState({errors});
      } else {
        // The PLANT_CREATE_SUCCESS action needs this to hide the note create form
        transformed.plantId = this.props.plant._id;
        if(isNew) {
          this.props.dispatch(actions.createNoteRequest(transformed));
        } else {
          this.props.dispatch(actions.updateNoteRequest(transformed));
        }
      }
    });
    e.preventDefault();
    e.stopPropagation();
  }

  cancel(e) {
    this.props.dispatch(actions.createNote({
      _id: this.props.plant._id,
      enable: false
    }));
    e.preventDefault();
    e.stopPropagation();
  }

  onChange(key, e) {
    this.setState({
      [key]: e.target.value
    });
  }

  render() {
    const {
      date,
      errors = {},
      note = '',
    } = this.state || {};

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
      <Paper style={paperStyle} zDepth={5}>

        <TextField
          errorText={errors.date}
          floatingLabelText='Date'
          fullWidth={true}
          hintText={'MM/DD/YYYY'}
          onChange={this.onChange.bind(this, 'date')}
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
          onChange={this.onChange.bind(this, 'note')}
          style={textAreaStyle}
          value={note}
        />

        {!_.isEmpty(errors) &&
          <div>
            <p className='text-danger col-xs-12'>{'There were errors. Please check your input.'}</p>
          </div>
        }

        <div style={{textAlign: 'right'}}>
          <RaisedButton
            label='Cancel'
            onClick={this.cancel.bind(this)}
          />
          <RaisedButton
            label='Save'
            onClick={this.save.bind(this)}
            style={{marginLeft: '10px'}}
          />
        </div>

      </Paper>
    );
  }
}

NoteCreateUpdate.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  note: React.PropTypes.object, // optional existing note if editing
  plant: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};
