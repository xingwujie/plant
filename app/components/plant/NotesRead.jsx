const CircularProgress = require('material-ui/CircularProgress').default;
const Immutable = require('immutable');
const metrics = require('../../libs/metrics');
const NoteRead = require('./NoteRead');
const Paper = require('material-ui/Paper').default;
const PropTypes = require('prop-types');
const React = require('react');

const List = Immutable.List;

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

    const metricNotes = metrics.notesToMetricNotes(sortedIds, notes);
    const renderedNotes = metricNotes.map(metricNote => {
      const { noteId } = metricNote;
      switch(metricNote.type) {
        case 'note':
          const { note } = metricNote;
          return (<NoteRead
            key={noteId}
            {...this.props}
            note={note}
          />);
        case 'since':
          const { sinceLast } = metricNote;
          return (<Paper key={noteId + '-sincelast'} style={paperStyle} zDepth={1}>
            {sinceLast}
          </Paper>);
        case 'metric':
          const { change } = metricNote;
          return (<Paper key={noteId + '-change'} style={paperStyle} zDepth={1}>
            {change}
          </Paper>);
        case 'unfound':
          return (<CircularProgress key={noteId} />);
        default:
          throw new Error(`Uknown note render type ${metricNote.type}`);
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
