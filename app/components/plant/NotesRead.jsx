import * as actions from '../../actions';
// import EditDeleteButtons from './EditDeleteButtons';
import Paper from 'material-ui/lib/paper';
import React from 'react';

export default class NotesRead extends React.Component {

  edit() {
    this.props.dispatch(actions.setPlantMode({
      _id: this.props.plant._id,
      mode: 'edit'
    }));
  }

  checkDelete() {
    this.setState({showDeleteConfirmation: true});
  }

  confirmDelete(yes) {
    if(yes) {
      this.props.dispatch(actions.deletePlantRequest(this.props.plant._id));
      // Transition to /plants
      this.context.history.pushState(null, '/plants');
    } else {
      this.setState({showDeleteConfirmation: false});
    }
  }

  render() {
    const {notes = []} = this.props || {};
    if(!notes.length) {
      return null;
    }

    const paperStyle = {
      padding: 20,
      width: '100%',
      margin: 20,
      display: 'inline-block'
    };

    return (
      <div>
        {notes.map(note => {
          return (
            <Paper key={note._id} style={paperStyle} zDepth={5}>
              <h5>{note.date}</h5>
              <div>{note.note}</div>
            </Paper>
            );
        })
        }
      </div>
    );

  }
}

NotesRead.propTypes = {
  notes: React.PropTypes.array,
};
