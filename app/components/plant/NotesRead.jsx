import React from 'react';
import NoteRead from './NoteRead';

export default class NotesRead extends React.Component {

  render() {
    const {notes = []} = this.props.plant || {};
    if(!notes.length) {
      return null;
    }

    let lastNoteDate;
    const renderedNotes = notes.map(note => {
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
  plant: React.PropTypes.object.isRequired,
};
