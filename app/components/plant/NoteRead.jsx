const actions = require('../../actions');
const Paper = require('material-ui/Paper').default;
const React = require('react');
const EditDeleteButtons = require('./EditDeleteButtons');
const moment = require('moment');
const LinkIcon = require('material-ui/svg-icons/content/link').default;
const utils = require('../../libs/utils');
const Markdown = require('../utils/Markdown');
const NoteReadMetrics = require('./NoteReadMetrics');
const NoteReadImages = require('./NoteReadImages');

class NoteRead extends React.Component {

  constructor(props) {
    super(props);
    this.checkDelete = this.checkDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.editNote = this.editNote.bind(this);
  }

  checkDelete() {
    this.setState({showDeleteConfirmation: true});
  }

  confirmDelete(yes) {
    if(yes) {
      this.props.dispatch(actions.deleteNoteRequest(this.props.note.get('_id')));
    } else {
      this.setState({showDeleteConfirmation: false});
    }
  }

  editNote() {
    const note = {
      ...this.props.note.toJS(),
      date: utils.intToString(this.props.note.get('date')),
      isNew: false
    };
    const {plant} = this.props;
    this.props.dispatch(actions.editNoteOpen({plant, note}));
  }

  render() {
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
      note
    } = this.props;

    const date = utils.intToMoment(note.get('date'));

    const noteDate = date.format('DD-MMM-YYYY') +
      (date.isSame(moment(), 'day')
      ? ' (today)'
      : ` (${date.from(moment().startOf('day'))})`);
    const noteId = note.get('_id');

    return (
      <Paper key={noteId} style={paperStyle} zDepth={1}>
        <div id={noteId}>
          <a href={`#${noteId}`}>
            <LinkIcon />
          </a>
        </div>
        <h5>{noteDate}</h5>
        <Markdown markdown={note.get('note')} />
        <NoteReadMetrics note={note} />
        <EditDeleteButtons
          clickDelete={this.checkDelete}
          clickEdit={this.editNote}
          confirmDelete={this.confirmDelete.bind(noteId)}
          deleteTitle={''}
          showButtons={isOwner}
          showDeleteConfirmation={showDeleteConfirmation}
        />
        <NoteReadImages note={note} />
      </Paper>
    );
  }
}

NoteRead.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  note: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
    toJS: React.PropTypes.func.isRequired,
  }).isRequired,
  plant: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
  }).isRequired,
  // plants: React.PropTypes.shape({
  //   get: React.PropTypes.func.isRequired,
  //   filter: React.PropTypes.func.isRequired,
  // }).isRequired,
  // user: React.PropTypes.shape({ // Immutable.js Map
  //   get: React.PropTypes.func.isRequired,
  // }).isRequired
};

module.exports = NoteRead;
