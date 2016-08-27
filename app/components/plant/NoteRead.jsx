import * as actions from '../../actions';
import Paper from 'material-ui/Paper';
import React from 'react';
import EditDeleteButtons from './EditDeleteButtons';

export default class NoteRead extends React.Component {

  constructor(props) {
    super(props);
    this.edit = this.edit.bind(this);
    this.checkDelete = this.checkDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  edit() {
    this.setState({
      editMode: true
    });
  }

  checkDelete() {
    this.setState({showDeleteConfirmation: true});
  }

  confirmDelete(yes) {
    if(yes) {
      this.props.dispatch(actions.deleteNoteRequest({
        noteId: this.props.note._id,
        plantId: this.props.plant._id,
      }));
    } else {
      this.setState({showDeleteConfirmation: false});
    }
  }

  renderEdit() {
    return null;
  }

  renderRead() {
    const paperStyle = {
      padding: 20,
      width: '100%',
      margin: 20,
      display: 'inline-block'
    };

    const {
      showDeleteConfirmation = false
    } = this.state || {};

    const {
      isOwner,
      note,
      sinceLast
    } = this.props;

    return (
      <Paper key={note._id} style={paperStyle} zDepth={5}>
        {sinceLast && <h6>{`(${sinceLast} since previous note)`}</h6>}
        <h5>{note.date.format('DD-MMM-YYYY')}{` (${note.date.fromNow()})`}</h5>
        <div>{note.note}</div>
        <EditDeleteButtons
          clickEdit={this.edit.bind(note._id)}
          clickDelete={this.checkDelete}
          confirmDelete={this.confirmDelete.bind(note._id)}
          showDeleteConfirmation={showDeleteConfirmation}
          showButtons={isOwner}
          deleteTitle={''}
        />
      </Paper>
      );
  }

  render() {
    const {
      editMode = false
    } = this.state || {};

    return editMode
      ? this.renderEdit()
      : this.renderRead();
  }

}

NoteRead.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  note: React.PropTypes.object.isRequired,
  plant: React.PropTypes.object.isRequired,
  sinceLast: React.PropTypes.string.isRequired,
};
