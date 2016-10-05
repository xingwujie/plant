const actions = require('../../actions');
const Paper = require('material-ui/Paper').default;
const React = require('react');
const EditDeleteButtons = require('./EditDeleteButtons');
const NoteUpdate = require('./NoteUpdate');
const moment = require('moment');
const LinkIcon = require('material-ui/svg-icons/content/link').default;
const utils = require('../../libs/utils');

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
      this.props.dispatch(actions.deleteNoteRequest(this.props.note._id));
    } else {
      this.setState({showDeleteConfirmation: false});
    }
  }

  renderEdit() {
    return (
      <NoteUpdate
        dispatch={this.props.dispatch}
        isOwner={this.props.isOwner}
        interimNote={this.props.interim.note.note}
        plant={this.props.plant}
      />
    );
  }

  buildImageUrl(size, id, ext) {
    const folder = process.env.NODE_ENV === 'production' ? 'up' : 'test';
    return `//i.plaaant.com/${folder}/${size}/${id}${ext && ext.length ? '.' : ''}${ext}`;
  }

  buildImageSrc(image) {
    const size = image.sizes && image.sizes.length
      ? image.sizes[image.sizes.length - 1].name
      : 'orig';
    return this.buildImageUrl(size, image.id, image.ext);
  }

  buildImageSrcSet(image) {
    if(image.sizes && image.sizes.length) {
      // <img src="small.jpg" srcset="medium.jpg 1000w, large.jpg 2000w" alt="yah">
      const items = image.sizes.map(size => `${this.buildImageUrl(size.name, image.id, image.ext)} ${size.width}w `);
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
      <div key={image.id}>
        <img style={imageStyle} src={this.buildImageSrc(image)} srcSet={this.buildImageSrcSet(image)} />
      </div>
    );
  }

  renderImages(note) {
    return (note.images || []).map(image => {
      return this.renderImage(image);
    });
  }

  editNote() {
    const note = {
      ...this.props.note,
      date: utils.intToString(this.props.note.date),
      isNew: false // TODO: is this still needed?
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
      note
    } = this.props;

    const images = this.renderImages(note);

    const date = utils.intToMoment(note.date);

    const noteDate = date.format('DD-MMM-YYYY') +
      (date.isSame(moment(), 'day')
      ? ' (today)'
      : ` (${date.from(moment().startOf('day'))})`);

    return (
      <Paper key={note._id} style={paperStyle} zDepth={1}>
        <div id={note._id}>
          <a href={`#${note._id}`}>
            <LinkIcon />
          </a>
        </div>
        <h5>{noteDate}</h5>
        <div>{note.note}</div>
        <EditDeleteButtons
          clickDelete={this.checkDelete}
          clickEdit={this.editNote}
          confirmDelete={this.confirmDelete.bind(note._id)}
          deleteTitle={''}
          showButtons={isOwner}
          showDeleteConfirmation={showDeleteConfirmation}
        />
        {!!images.length && images}
      </Paper>
      );
  }

  render() {
    const note = this.props.interim && this.props.interim.note && this.props.interim.note.note;

    return note && note._id === this.props.note._id
      ? this.renderEdit()
      : this.renderRead();
  }

}

NoteRead.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  interim: React.PropTypes.shape({
    note: React.PropTypes.shape({
      note: React.PropTypes.object.isRequired,
      plant: React.PropTypes.object.isRequired,
    })
  }).isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  note: React.PropTypes.object.isRequired,
  plant: React.PropTypes.object.isRequired,
};

module.exports = NoteRead;
