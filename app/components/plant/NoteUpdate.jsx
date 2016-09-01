// Used to add a note to a plant

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
  }

  componentWillMount() {
    this.initState();
  }

  initState() {
    const {note} = this.props;
    this.setState({
      plantNote: {
        ...note,
        date: note.date.format('MM/DD/YYYY')
      }
    });
  }

  cancel() {
    this.initState();
    this.props.cancel();
  }

  save(e) {
    const {plantNote} = this.state;

    if(plantNote.plantIds.indexOf(this.props.plant._id) === -1) {
      plantNote.plantIds.push(this.props.plant._id);
    }

    validate(plantNote, {isNew: false}, (errors, transformed) => {
      if(errors) {
        plantNote.errors = errors;
        this.setState({plantNote});
      } else {
        this.props.dispatch(actions.updateNoteRequest(transformed));
        this.initState();
        this.props.cancel();
      }
    });
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
      plantNote
    } = this.state || {};

    return (
      <NoteCreateUpdate
        cancel={this.cancel}
        onChange={this.onChange}
        plantNote={plantNote}
        save={this.save}
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
