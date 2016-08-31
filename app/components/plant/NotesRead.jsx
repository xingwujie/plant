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

    const sortedIds = noteIds.sort((a, b) => {
      const noteA = this.props.notes[a];
      const noteB = this.props.notes[b];
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
      padding: 20,
      width: '100%',
      margin: 20,
      display: 'inline-block'
    };

    let lastNoteDate;
    const renderedNotes = sortedIds.reduce((acc, noteId) => {
      const note = this.props.notes[noteId];
      if(note) {
        const sinceLast = lastNoteDate ? `...and then after ${lastNoteDate.from(note.date, true)}` : '';
        lastNoteDate = note.date;
        if(sinceLast) {
          acc.push(
            <Paper key={note._id + '-sincelast'} style={paperStyle} zDepth={1}>
              {sinceLast}
            </Paper>
          );
        }
        acc.push(
          <NoteRead
            key={note._id}
            {...this.props}
            note={note}
          />
        );
      } else {
        acc.push(
          <CircularProgress />
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
  isOwner: React.PropTypes.bool.isRequired,
  notes: React.PropTypes.object.isRequired,
  plant: React.PropTypes.object.isRequired,
};
