const actions = require('../../actions');
const EditDeleteButtons = require('./EditDeleteButtons');
const Immutable = require('immutable');
const LinkIcon = require('material-ui/svg-icons/content/link').default;
const Markdown = require('../utils/Markdown');
const moment = require('moment');
const NoteReadMetrics = require('./NoteReadMetrics');
const NoteUpdate = require('./NoteUpdate');
const NoteAssocPlantList = require('./NoteAssocPlantList');
const Paper = require('material-ui/Paper').default;
const React = require('react');
const utils = require('../../libs/utils');

const List = Immutable.List;

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

  renderEdit() {
    return (
      <NoteUpdate
        dispatch={this.props.dispatch}
        isOwner={this.props.isOwner}
        interimNote={this.props.interim.getIn(['note', 'note'])}
        plant={this.props.plant}
        plants={this.props.plants}
        user={this.props.user}
      />
    );
  }

  buildImageUrl(size, image) {
    const id = image.get('id');
    const ext = image.get('ext');
    const folder = process.env.NODE_ENV === 'production' ? 'up' : 'test';
    return `//i.plaaant.com/${folder}/${size}/${id}${ext && ext.length ? '.' : ''}${ext}`;
  }

  buildImageSrc(image) {
    const sizes = image.get('sizes', List()).toJS();
    const size = sizes && sizes.length
      ? sizes[sizes.length - 1].name
      : 'orig';
    return this.buildImageUrl(size, image);
  }

  buildImageSrcSet(image) {
    const sizes = image.get('sizes', List()).toJS();
    if(sizes && sizes.length) {
      // <img src="small.jpg" srcset="medium.jpg 1000w, large.jpg 2000w" alt="yah">
      const items = sizes.map(size => `${this.buildImageUrl(size.name, image)} ${size.width}w `);
      return items.join(',');
    } else {
      return '';
    }
  }

  renderImage(image) {
    const imageStyle = {
      maxWidth: '100%',
      padding: '1%'
    };
    return (
      <div key={image.get('id')}>
        <img style={imageStyle} src={this.buildImageSrc(image)} srcSet={this.buildImageSrcSet(image)} />
      </div>
    );
  }

  renderImages(note) {
    const images = note.get('images');
    if(images && images.size) {
      return images.map(image => {
        return this.renderImage(image);
      });
    } else {
      return null;
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

  renderRead() {
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
      note,
      plant,
    } = this.props;

    const images = this.renderImages(note);

    const date = utils.intToMoment(note.get('date'));

    const noteDate = date.format('DD-MMM-YYYY') +
      (date.isSame(moment(), 'day')
      ? ' (today)'
      : ` (${date.from(moment().startOf('day'))})`);
    const noteId = note.get('_id');
    const associatedPlantIds = note.get('plantIds', Immutable.List());
    const currentPlantId = plant.get('_id');

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
        <NoteAssocPlantList
          associatedPlantIds={associatedPlantIds}
          currentPlantId={currentPlantId}
          plants={this.props.plants}
        />
        {images}
      </Paper>
    );
  }

  render() {
    const noteId = this.props.interim.getIn(['note', 'note', '_id']);

    return noteId === this.props.note.get('_id')
      ? this.renderEdit()
      : this.renderRead();
  }

}

NoteRead.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  interim: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
    getIn: React.PropTypes.func.isRequired,
  }).isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  note: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
    toJS: React.PropTypes.func.isRequired,
  }).isRequired,
  plant: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
  }).isRequired,
  plants: React.PropTypes.shape({
    get: React.PropTypes.func.isRequired,
    filter: React.PropTypes.func.isRequired,
  }).isRequired,
  user: React.PropTypes.shape({ // Immutable.js Map
    get: React.PropTypes.func.isRequired,
  }).isRequired
};

module.exports = NoteRead;
