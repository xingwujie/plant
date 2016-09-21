import * as actions from '../../actions';
import Paper from 'material-ui/Paper';
import React from 'react';
import EditDeleteButtons from './EditDeleteButtons';
import NoteUpdate from './NoteUpdate';
const moment = require('moment');
import LinkIcon from 'material-ui/svg-icons/content/link';

export default class NoteRead extends React.Component {

  constructor(props) {
    super(props);
    this.checkDelete = this.checkDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
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
        cancel={() => this.setState({editMode: false})}
        dispatch={this.props.dispatch}
        isOwner={this.props.isOwner}
        note={this.props.note}
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

    const noteDate = note.date.format('DD-MMM-YYYY') +
      (note.date.isSame(moment(), 'day')
      ? ' (today)'
      : ` (${note.date.from(moment().startOf('day'))})`);

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
          clickEdit={() => this.setState({editMode: true})}
          clickDelete={this.checkDelete}
          confirmDelete={this.confirmDelete.bind(note._id)}
          showDeleteConfirmation={showDeleteConfirmation}
          showButtons={isOwner}
          deleteTitle={''}
        />
        {!!images.length && images}
      </Paper>
      );
  }

  render() {
    const {
      editMode = false
    } = this.state || {};

    return editMode
      ? this.renderEdit()
      : this.renderRead();
  }

}

NoteRead.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
  note: React.PropTypes.object.isRequired,
  plant: React.PropTypes.object.isRequired,
  // sinceLast: React.PropTypes.string.isRequired,
};
