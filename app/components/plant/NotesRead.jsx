import * as actions from '../../actions';
// import EditDeleteButtons from './EditDeleteButtons';
import Paper from 'material-ui/Paper';
import React from 'react';
import * as utils from '../../libs/utils';

export default class NotesRead extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

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
      // Transition to /plants/:slug/:id
      const plantUrl = utils.makePlantsUrl(this.props.user);
      this.context.router.push(plantUrl);
    } else {
      this.setState({showDeleteConfirmation: false});
    }
  }

  render() {
    const {notes = []} = this.props.plant || {};
    if(!notes.length) {
      return null;
    }

    const paperStyle = {
      padding: 20,
      width: '100%',
      margin: 20,
      display: 'inline-block'
    };
    let lastNoteDate;
    return (
      <div>
        {notes.map(note => {
          const sinceLast = lastNoteDate ? lastNoteDate.from(note.date) : '';
          lastNoteDate = note.date;
          return (
            <Paper key={note._id} style={paperStyle} zDepth={5}>
              {sinceLast && <h6>{`(${sinceLast} since previous note)`}</h6>}
              <h5>{note.date.format('DD-MMM-YYYY')}{` (${note.date.fromNow()})`}</h5>
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
  dispatch: React.PropTypes.func.isRequired,
  plant: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};
