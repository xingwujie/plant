const actions = require('../../actions');
const CircularProgress = require('material-ui/CircularProgress').default;
const React = require('react');
const NoteRead = require('./NoteRead');
const Paper = require('material-ui/Paper').default;
const utils = require('../../libs/utils');

class NotesRead extends React.Component {

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
        if(noteA.date === noteB.date) {
          return 0;
        }
        return noteA.date > noteB.date ? 1 : -1;
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
        const currentNoteDate = utils.intToMoment(note.date);
        const sinceLast = lastNoteDate ? `...and then after ${lastNoteDate.from(currentNoteDate, true)}` : '';
        if(sinceLast && !lastNoteDate.isSame(currentNoteDate)) {
          acc.push(
            <Paper key={noteId + '-sincelast'} style={paperStyle} zDepth={1}>
              {sinceLast}
            </Paper>
          );
        }
        lastNoteDate = currentNoteDate;
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
  interim: React.PropTypes.shape({
    note: React.PropTypes.shape({
      note: React.PropTypes.object.isRequired,
      plant: React.PropTypes.object.isRequired,
    })
  }).isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  notes: React.PropTypes.object.isRequired,
  plant: React.PropTypes.object.isRequired,
  plants: React.PropTypes.object.isRequired, // Immutable.js Map
  user: React.PropTypes.shape({ // Immutable.js Map
    get: React.PropTypes.func.isRequired,
  }).isRequired
};

module.exports = NotesRead;
