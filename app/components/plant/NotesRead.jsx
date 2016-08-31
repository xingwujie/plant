import CircularProgress from 'material-ui/CircularProgress';
import React from 'react';
import NoteRead from './NoteRead';

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

    let lastNoteDate;
    const renderedNotes = sortedIds.map(noteId => {
      const note = this.props.notes[noteId];
      if(note) {
        const sinceLast = lastNoteDate ? lastNoteDate.from(note.date) : '';
        lastNoteDate = note.date;
        return (
          <NoteRead
            key={note._id}
            {...this.props}
            note={note}
            sinceLast={sinceLast}
          />
        );
      } else {
        return (
          <CircularProgress />
        );
      }
    });

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
