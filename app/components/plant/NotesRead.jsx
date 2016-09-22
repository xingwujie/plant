import * as actions from '../../actions';
import CircularProgress from 'material-ui/CircularProgress';
import React from 'react';
import NoteRead from './NoteRead';
import Paper from 'material-ui/Paper';

export default class NotesRead extends React.Component {

  render() {
    const noteIds = [...(this.props.plant && this.props.plant.notes || [])];
    if(!noteIds.length) {
      return null;
    }
    const {notes} = this.props;

    // Find unloaded notes
    const unloaded = noteIds.reduce((acc, noteId) => {
      if(!notes[noteId]) {
        acc.push(noteId);
      }
      return acc;
    }, []);
    if(unloaded.length) {
      this.props.dispatch(actions.loadNotesRequest(unloaded));
    }

    const sortedIds = noteIds.sort((a, b) => {
      const noteA = notes[a];
      const noteB = notes[b];
      if(noteA && noteB) {
        if(noteA.date.isSame(noteB.date)) {
          return 0;
        }
        return noteA.date.isAfter(noteB.date) ? 1 : -1;
      } else {
        return 0;
      }
    });

    const paperStyle = {
      backgroundColor: '#ddd',
      display: 'inline-block',
      margin: 20,
      padding: 20,
      width: '100%',
    };

    let lastNoteDate;
    const renderedNotes = sortedIds.reduce((acc, noteId) => {
      const note = notes[noteId];
      if(note) {
        const sinceLast = lastNoteDate ? `...and then after ${lastNoteDate.from(note.date, true)}` : '';
        if(sinceLast && !lastNoteDate.isSame(note.date)) {
          acc.push(
            <Paper key={noteId + '-sincelast'} style={paperStyle} zDepth={1}>
              {sinceLast}
            </Paper>
          );
        }
        lastNoteDate = note.date;
        acc.push(
          <NoteRead
            key={noteId}
            {...this.props}
            note={note}
          />
        );
      } else {
        acc.push(
          <CircularProgress key={noteId} />
        );
      }
      return acc;
    }, []);

    return (
      <div>
        {renderedNotes}
      </div>
    );

  }
}

NotesRead.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  interim: React.PropTypes.object.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  notes: React.PropTypes.object.isRequired,
  plant: React.PropTypes.object.isRequired,
};
