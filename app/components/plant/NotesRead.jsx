const CircularProgress = require('material-ui/CircularProgress').default;
const React = require('react');
const NoteRead = require('./NoteRead');
const Paper = require('material-ui/Paper').default;
const utils = require('../../libs/utils');
const Immutable = require('immutable');
const List = Immutable.List;
const PropTypes = require('prop-types');

class NotesRead extends React.Component {

  sortNotes(props = this.props) {
    const noteIds = props.plant.get('notes', List());
    if(!(List.isList(noteIds) || Immutable.Set.isSet(noteIds))) {
      console.error('Not a List or Set from plant.get notes:', props.plant, noteIds);
    }

    if(!noteIds.size) {
      return;
    }
    const {notes} = props;

    const sortedIds = noteIds.sort((a, b) => {
      const noteA = notes.get(a);
      const noteB = notes.get(b);
      if(noteA && noteB) {
        const dateA = noteA.get('date');
        const dateB = noteB.get('date');
        if(dateA === dateB) {
          return 0;
        }
        return dateA > dateB ? 1 : -1;
      } else {
        return 0;
      }
    });

    this.setState({sortedIds});
  }

  componentWillReceiveProps(nextProps) {
    this.sortNotes(nextProps);
  }

  componentWillMount() {
    this.sortNotes();
  }

  render() {
    const {notes} = this.props;
    const { sortedIds } = this.state || {};
    if(!sortedIds || !sortedIds.size) {
      return null;
    }

    const paperStyle = {
      backgroundColor: '#ddd',
      display: 'inline-block',
      margin: 20,
      padding: 20,
      width: '100%',
    };

    let lastNoteDate;
    const renderedNotes = sortedIds.reduce((acc, noteId) => {
      const note = notes.get(noteId);
      if(note) {
        const currentNoteDate = utils.intToMoment(note.get('date'));
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
  dispatch: PropTypes.func.isRequired,
  interim: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,
  isOwner: PropTypes.bool.isRequired,
  notes:  PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,
  plant:  PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,
  plants:  PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({ // Immutable.js Map
    get: PropTypes.func.isRequired,
  }).isRequired
};

module.exports = NotesRead;
